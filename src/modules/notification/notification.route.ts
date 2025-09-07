import { Router } from "express";
import { notificationController } from "./notification.controller";

const router: Router = Router();

router.post("/", notificationController.createNotification);
router.get("/", notificationController.getAllNotification);
router.get("/:id", notificationController.getNotificationById);
router.patch("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

export const notificationRoutes = router;