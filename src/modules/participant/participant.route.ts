import { Router } from "express";
import { participantController } from "./participant.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";
import fileUpload from "express-fileupload";
import fileHandler from "../../middlewares/fileHandler";
import parseData from "../../middlewares/parseData";

const router: Router = Router();

router.post(
  "/create",
  auth(UserRole.Employee),
  participantController.createParticipant
);
router.post(
  "/upload-video",
  fileUpload(),
  fileHandler,
  parseData(),
  auth(UserRole.Employee),
  participantController.uploadVideo
);
router.get(
  "/",
  auth(UserRole.Employee, UserRole.Employer, UserRole.Admin),
  participantController.getAllParticipant
);
router.get("/:id", participantController.getParticipantById);
router.patch("/:id", participantController.updateParticipant);
router.delete("/:id", participantController.deleteParticipant);

export const participantRoutes = router;
