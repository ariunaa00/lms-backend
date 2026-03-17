import { Router } from "express";
import { createAdmin, loginAdmin, loginUser } from "../controllers/authController";
import { registerUser } from "../controllers/userController";

const router = Router();

router.post("/admin/login", loginAdmin);
router.post("/admin", createAdmin);

router.post("/user/login", loginUser);
router.post("/user/signup", registerUser);
export default router;