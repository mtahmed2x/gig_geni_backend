import { Router } from "express";
import { meetingController } from "./meeting.controller";

const router: Router = Router();

router.post("/create", meetingController.createMeeting);
router.get("/", meetingController.getAllMeeting);
router.get("/:id", meetingController.getMeetingById);
router.patch("/update/:id", meetingController.updateMeeting);
router.delete("/delete/:id", meetingController.deleteMeeting);

export const meetingRoutes = router;