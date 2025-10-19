import { Router } from "express";
import { quizAttemptController } from "./quizAttempt.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";

const router: Router = Router();

router.post(
  "/submit",
  auth(UserRole.Employee),
  quizAttemptController.submitQuizAttempt
);
router.get("/", quizAttemptController.getQuizAttemptsForCompetition);
router.get("/:id", quizAttemptController.getQuizAttemptById);

export const quizAttemptRoutes = router;
