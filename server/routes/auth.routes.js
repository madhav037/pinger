import { Router } from "express";
import { signin, signOut, signup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", signOut);

export default router;