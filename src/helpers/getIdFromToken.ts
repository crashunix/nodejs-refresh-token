import { verify } from "jsonwebtoken";

export default (headerToken: string) => {
    const [, token ] = headerToken.split(" ");

    const tokenId = verify(token, process.env.JWT_SECRET);
    return tokenId.sub.toString();
}