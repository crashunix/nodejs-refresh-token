import { context } from "../prisma/context"
import dayjs from "dayjs";

class GenerateRefreshTokenProvider {
    async execute(userId: string) {
        const expiresIn = dayjs().add(30, "day").unix();
        const generateRefreshToken = await context.refreshToken.create({
            data: {
                userId,
                expiresIn
            }
        });
        return generateRefreshToken;
    }
}

export { GenerateRefreshTokenProvider }