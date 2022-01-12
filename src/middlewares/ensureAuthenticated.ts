import { NextFunction, Request, response, Response } from "express";
import { verify } from "jsonwebtoken";

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization;

    console.log(authToken);

    if(!authToken) {
        return res.status(401).json({
            message: "Token is missing"
        });
    }

    const [, token ] = authToken.split(" ");

    try {
        verify(token, process.env.JWT_SECRET);
        return next();
    } catch(err) {
        return res.status(401).json({
            message: "Token is invalid"
        });
    }
}

export { ensureAuthenticated };