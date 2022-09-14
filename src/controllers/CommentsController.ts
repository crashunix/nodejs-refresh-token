import { hash } from "bcryptjs";
import { Request, Response } from "express"
import generateSlug from "../helpers/generateSlug";
import getIdFromToken from "../helpers/getIdFromToken";
import { context } from "../prisma/context";

class CommentsController {
    detail = async (request: Request, response: Response) => {
        const comment = context.comment.findFirst({
            where: {
                id: request.params.id
            },
            select: {
                id: true,
                text: true,
                createdAt: true,
                author: true
            }
        });
        comment.then(cat => {
            return response.status(200).json(cat);
        });
    }
    delete = async (request: Request, response: Response) => {
        const comment = context.comment.delete({
            where: {
                id: request.params.id,
            },
        });
        comment.catch(err => {
            return response.status(400).json(err);
        });
        return response.status(200);
    }
    list = async (request: Request, response: Response) => {
        const comments = context.comment.findMany({
            select: {
                id: true,
                text: true,
                createdAt: true,
                author: true
            }
        });
        comments.then(cmts => {
            return response.status(200).json(cmts);
        });
    }
    create = async (request: Request, response: Response) => {
        const { text } = request.body;
        const postId = request.params.postId;

        const userId = getIdFromToken(request.headers.authorization);

        // cadastra se não existir
        const comment = await context.comment.create({
            data: {
                text,
                userId,
                postId
            },
            select: {
                id: true,
                text: true,
                author: true,
                createdAt: true
            }
        });

        return response.status(200).json(comment);
    }
}

export { CommentsController }