import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "./user.constant";

const router: Router = Router();

router.get(
  "/profile",
  auth(UserRole.Talent, UserRole.Employer),
  userController.getProfile
);
router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);
router.patch(
  "/update",
  auth(UserRole.Talent, UserRole.Employer),
  userController.updateUser
);
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;
