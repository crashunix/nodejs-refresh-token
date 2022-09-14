import { hash } from "bcryptjs";
import { Request, Response } from "express"
import generateSlug from "../helpers/generateSlug";
import getIdFromToken from "../helpers/getIdFromToken";
import { context } from "../prisma/context";

class PostsController {
    detail = async (request: Request, response: Response) => {
        const post = context.post.findFirst({
            where: {
                slug: request.params.slug,
                status: true,
            },
            select: {
                id: true,
                title: true,
                subtitle: true,
                slug: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        avatar: true,
                        role: true
                    }
                },
                comments: {
                    select: {
                        id: true,
                        text: true,
                        createdAt: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                email: true,
                                avatar: true,
                                role: true
                            }
                        }
                    }
                },
                category: true,
                createdAt: true,
                status: true,
                cover: true
            }
        });
        post.then(psts => {
            return response.status(200).json(psts);
        });
    }
    delete = async (request: Request, response: Response) => {
        const post = context.post.update({
            where: {
                id: request.params.id,
            },
            data: {
                status: false
            }
        });
        post.then(psts => {
            return response.status(200).json(psts);
        }).catch(err => {
            return response.status(400).json(err);
        });
    }


    list = async (request: Request, response: Response) => {
        const posts = context.post.findMany({
            where: {
                status: true,
            },
            select: {
                id: true,
                title: true,
                subtitle: true,
                slug: true,
                author: true,
                userId: true,
                createdAt: true,
                status: true,
                cover: true,
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        posts.then(psts => {
            return response.status(200).json(psts);
        });
    }
    create = async (request: Request, response: Response) => {
        const { title, subtitle, status, cover, categoryId } = request.body;

        const slug = generateSlug(title);

        const userId = getIdFromToken(request.headers.authorization);

        // verificar se o usuário existe
        const postAlreadyExists = await context.post.findFirst({
            where: {
                slug
            }
        });

        if (postAlreadyExists) {
            throw new Error("User already exists");
        }

        // cadastra se nõa existir
        const post = await context.post.create({
            data: {
                title,
                subtitle,
                slug,
                userId,
                status,
                categoryId,
                cover
            },
            select: {
                id: true,
                title: true,
                subtitle: true,
                slug: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        avatar: true,
                        role: true
                    }
                },
                createdAt: true,
                status: true
            }
        });

        return response.status(200).json(post);
    }
}

export { PostsController }