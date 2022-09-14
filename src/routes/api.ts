import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UsersController } from '../controllers/UsersController';
import { PostsController } from '../controllers/PostsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { CategoriesController } from '../controllers/CategoriesController';
import { CommentsController } from '../controllers/CommentsController';

const router = Router();

const usersController = new UsersController();
const authController = new AuthController();
const postsController = new PostsController();
const categoriesController = new CategoriesController();
const commentsController = new CommentsController();

router.get("/users", ensureAuthenticated, usersController.list);
router.post("/users", usersController.create);
router.post("/auth/signin", authController.signin);
router.post("/auth/refresh-token", ensureAuthenticated, authController.refreshToken);
router.get("/auth/me", ensureAuthenticated, authController.me);

router.get("/posts", postsController.list);
router.post("/posts", ensureAuthenticated, postsController.create);
router.get("/posts/:slug", postsController.detail);
router.delete("/posts/:id", ensureAuthenticated, postsController.delete);

router.get("/categories", categoriesController.list);
router.post("/categories", ensureAuthenticated, categoriesController.create);
router.get("/categories/:id", categoriesController.detail);
router.delete("/categories/:id", ensureAuthenticated, categoriesController.delete);

router.get("/comments", commentsController.list);
router.post("/comments/:postId", ensureAuthenticated, commentsController.create);
router.get("/comments/:id", commentsController.detail);
router.delete("/comments/:id", ensureAuthenticated, commentsController.delete);

export { router };