import { Router } from "express";
import { userController } from "./user.controller";

const router: Router = Router();

router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;
