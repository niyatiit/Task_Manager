import { Router} from 'express'
import { adminOnly, protect } from '../middleware/Auth.Middleware.js';
import { getUser , getUserById , deleteUser } from '../controller/User.Controller.js';

const userRouter = Router();

userRouter.route("/").get(protect , adminOnly , getUser)
userRouter.route("/:id").get(protect , getUserById)
userRouter.route("/:id").delete(protect , adminOnly , deleteUser)


export { userRouter}