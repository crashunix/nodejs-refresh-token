import { compare } from "bcryptjs";
import dayjs from "dayjs";
import { Request, response, Response } from "express";
import getIdFromToken from "../helpers/getIdFromToken";
import { context } from "../prisma/context";
import { GenerateRefreshTokenProvider } from "../providers/GenerateRefreshTokenProvider";
import { GenerateTokenProvider } from "../providers/GenerateTokenProvider";

class AuthController {
    signin = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        const userAlreadyExists = await context.user.findFirst({
            where: {
                username,
            }
        });

        if(!userAlreadyExists) {
            throw new Error("User or password incorrect");
        }
        
        const passwordMatch = await compare(password, userAlreadyExists.password);
        
        if(!passwordMatch) {
            throw new Error("User or password incorrect");
        }

        const generateTokenProvider = new GenerateTokenProvider();
        const token = await generateTokenProvider.execute(userAlreadyExists.id);

        await context.refreshToken.deleteMany({
            where: {
                userId: userAlreadyExists.id
            }
        });

        const generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
        const refreshToken = await generateRefreshTokenProvider.execute(userAlreadyExists.id);

        return res.status(200).json({ token, refreshToken, user: { id: userAlreadyExists.id, name: userAlreadyExists.name, username: userAlreadyExists.username, email: userAlreadyExists.email, avatar: userAlreadyExists.avatar, role: userAlreadyExists.role } });
    }

    me = async (req: Request, res: Response) => {
        const userId = getIdFromToken(req.headers.authorization);
        const user = await context.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatar: true,
                role: true
            }
        });
        return res.status(200).json(user);
    }

    refreshToken = async (req: Request, res: Response) => {
        const { refresh_token } = req.body;
        console.log(refresh_token);
        const refreshToken = await context.refreshToken.findFirst({
            where: {
                id: refresh_token
            }
        });
        
        if (!refreshToken) {
            throw new Error("Refresh token not found");
        }
        
        const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));
        
        if(refreshTokenExpired) {    
            throw new Error("Refresh token invalid!");
        }
        
        await context.refreshToken.deleteMany({
            where: {
                userId: refreshToken.userId
            }
        });
        
        const generateTokenProvider = new GenerateTokenProvider();
        const token = await generateTokenProvider.execute(refreshToken.userId);
        console.log("novo access token: ", token);

        const  generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
        const newRefreshToken = await generateRefreshTokenProvider.execute(refreshToken.userId);
        console.log("novo refresh token: ", newRefreshToken);
        
        return res.status(200).json({ token, refreshToken: newRefreshToken });
    }
}

export { AuthController }