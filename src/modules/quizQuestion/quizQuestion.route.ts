import { Router } from "express";
import { quizQuestionController } from "./quizQuestion.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";

const router: Router = Router();

router.post(
  "/create",
  auth(UserRole.Employer),
  quizQuestionController.createQuizQuestion
);

router.post(
  "/create-multiple",
  auth(UserRole.Employer),
  quizQuestionController.addMultipleQuizQuestions
);

router.post(
  "/generate",
  auth(UserRole.Employer),
  quizQuestionController.generateQuizQuestions
);
router.get("/", quizQuestionController.getAllQuizQuestion);
router.get(
  "/:id",
  auth(UserRole.Employer),
  quizQuestionController.getQuizQuestionById
);
router.patch(
  "/update/:id",
  auth(UserRole.Employer),
  quizQuestionController.updateQuizQuestion
);
router.delete(
  "/delete/:id",
  auth(UserRole.Employer),
  quizQuestionController.deleteQuizQuestion
);

export const quizQuestionRoutes = router;
