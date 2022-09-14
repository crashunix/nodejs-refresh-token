import { hash } from "bcryptjs";
import { Request, Response } from "express"
import generateSlug from "../helpers/generateSlug";
import getIdFromToken from "../helpers/getIdFromToken";
import { context } from "../prisma/context";

class CategoriesController {
    detail = async (request: Request, response: Response) => {
        const category = context.category.findFirst({
            where: {
                id: request.params.id
            },
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
                posts: true
            }
        });
        category.then(cat => {
            return response.status(200).json(cat);
        });
    }
    delete = async (request: Request, response: Response) => {
        const category = context.category.delete({
            where: {
                id: request.params.id,
            },
        });
        category.catch(err => {
            return response.status(400).json(err);
        });
        return response.status(200);
    }
    list = async (request: Request, response: Response) => {
        const categories = context.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true
            }
        });
        categories.then(ctgrs => {
            return response.status(200).json(ctgrs);
        });
    }
    create = async (request: Request, response: Response) => {
        const { name } = request.body;
        const slug = generateSlug(name);

        // verificar se o usuário existe
        const categoryAlreadyExists = await context.category.findFirst({
            where: {
                slug
            }
        });

        if (categoryAlreadyExists) {
            throw new Error("Category already exists");
        }

        // cadastra se não existir
        const category = await context.category.create({
            data: {
                name,
                slug
            },
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true
            }
        });

        return response.status(200).json(category);
    }
}

export { CategoriesController }