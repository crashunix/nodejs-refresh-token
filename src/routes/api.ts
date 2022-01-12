import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { CommandsController } from '../controllers/CommandsController';
import { UsersController } from '../controllers/UsersController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const router = Router();

const usersController = new UsersController();
const authController = new AuthController();
const commandsController = new CommandsController();

router.get("/users", usersController.list);
router.post("/users", usersController.create);
router.post("/auth/signin", authController.signin);
router.post("/auth/refresh-token", authController.refreshToken);
router.get("/auth/me", ensureAuthenticated, authController.me);

router.get("/commands", ensureAuthenticated, commandsController.list);
router.get("/commands/:id", ensureAuthenticated, commandsController.view);

export { router };