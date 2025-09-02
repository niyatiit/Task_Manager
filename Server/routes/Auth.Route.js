import {Router} from 'express'
import { getUserProfile, login, register, updateUserProfile } from '../controller/Auth.Controller.js';
import { adminOnly, protect } from '../middleware/Auth.Middleware.js';

const userRouter = Router();

userRouter.route('/register').post(register) //Registration User
userRouter.route('/login').post(login) // Login User
userRouter.route('/profile').get(protect , getUserProfile) // Get User Profile
userRouter.route('/profile').put(adminOnly,updateUserProfile) // Update Profile 

export {userRouter}
