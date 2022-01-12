import { hash } from "bcryptjs";
import { Request, Response } from "express"
import { context } from "../prisma/context";

class UsersController {
    list = async (request: Request, response: Response) => {
        const users = context.user.findMany({
            where: {
                status: true,
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true
            }
        });
        users.then(usrs => {
            return response.status(200).json(usrs);
        });
    }
    create = async (request: Request, response: Response) => {
        const { username, name, email, password, avatar } = request.body;
        // verificar se o usuário existe
        const userAlreadyExists = await context.user.findFirst({
            where: {
                username
            }
        });

        if(userAlreadyExists) {
            throw new Error("User already exists");
        }

        const passwordHash = await hash(password, 8);

        // cadastra se nõa existir
        const user = await context.user.create({
            data: {
                name,
                username,
                email,
                password: passwordHash,
                avatar
            }
        });

        return response.status(200).json(user);
    }
}

export { UsersController }