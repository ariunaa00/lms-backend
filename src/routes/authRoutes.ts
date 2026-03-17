import { Router } from "express";
import { loginAdmin, loginUser } from "../controllers/authController";
import { registerUser } from "../controllers/userController";

const router = Router();

router.post("/admin/login", loginAdmin);
router.post("/user/login", loginUser);
router.post("/user/signup", registerUser);
export default router;