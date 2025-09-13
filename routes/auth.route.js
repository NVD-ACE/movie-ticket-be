import {Router} from "express";
import {signIn, signOut, signUp} from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post('/sign-up', signUp);
authRoute.post('/sign-in', signIn);
authRoute.post('/sign-out', signOut);

export default authRoute;
