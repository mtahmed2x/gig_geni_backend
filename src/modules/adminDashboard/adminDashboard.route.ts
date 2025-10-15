import { Router } from "express";
import { adminDashboardController } from "./adminDashboard.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";

const router: Router = Router();

router.post("/", adminDashboardController.createAdminDashboard);
router.get(
  "/",
  auth(UserRole.Admin),
  adminDashboardController.getAllAdminDashboard
);
router.get("/users", auth(UserRole.Admin), adminDashboardController.getAllUser);
router.get(
  "/competitions",
  auth(UserRole.Admin),
  adminDashboardController.getAllCompetition
);
router.get("/:id", adminDashboardController.getAdminDashboardById);
router.patch("/:id", adminDashboardController.updateAdminDashboard);
router.delete("/:id", adminDashboardController.deleteAdminDashboard);

export const adminDashboardRoutes = router;
