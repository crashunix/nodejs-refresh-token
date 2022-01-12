import { Request, Response } from "express"

class CommandsController {
    list = async (request: Request, response: Response) => {
        return response.status(200).json([
            {
                id: 1,
                command: "say",
            },
            {
                id: 2,
                command: "say_team",
            },
        ]);
    }
    view = async (request: Request, response: Response) => {
        return response.status(200).json({
            id: request.query,
            command: "say",
        });
    }
}

export { CommandsController }