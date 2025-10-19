import { Router } from "express";
import { participantController } from "./participant.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";

const router: Router = Router();

router.post(
  "/create",
  auth(UserRole.Employee),
  participantController.createParticipant
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
