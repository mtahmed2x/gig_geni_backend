import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";

const router: Router = Router();

router.post("/register", authController.register);
router.post(
  "/verifyOTP",
  auth(UserRole.Employee, UserRole.Employer),
  authController.verifyOTP
);
router.post(
  "/resendOTP",
  auth(UserRole.Employee, UserRole.Employer),
  authController.resendOTP
);
router.post("/login", authController.login);
router.post(
  "/logout",
  auth(UserRole.Employee, UserRole.Employer),
  authController.logout
);
// router.get("/:id", authController.getAuthById);
// router.patch("/:id", authController.updateAuth);
// router.delete("/:id", authController.deleteAuth);

export const authRoutes = router;
