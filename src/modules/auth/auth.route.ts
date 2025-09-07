import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";

const router: Router = Router();

router.post("/register", authController.register);
router.post("/verifyOTP", auth(UserRole.User), authController.verifyOTP);
router.post("/resendOTP", auth(UserRole.User), authController.resendOTP);
router.post("/login", authController.login);
router.post("/logout", auth(UserRole.User), authController.logout);
// router.get("/:id", authController.getAuthById);
// router.patch("/:id", authController.updateAuth);
// router.delete("/:id", authController.deleteAuth);

export const authRoutes = router;
