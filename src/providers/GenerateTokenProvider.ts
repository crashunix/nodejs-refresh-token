import { sign } from "jsonwebtoken";

class GenerateTokenProvider {
    async execute(userId: string) {
        const token = sign({}, "822f4eaf-f9b2-48e6-8ee8-8f71f92b47ca", {
            subject: userId,
            expiresIn: "90000s"
        });
        return token;
    }
}

export { GenerateTokenProvider }