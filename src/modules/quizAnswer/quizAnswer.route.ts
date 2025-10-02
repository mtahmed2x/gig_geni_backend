import { Router } from "express";
import { quizAnswerController } from "./quizAnswer.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";

const router: Router = Router();

router.post(
  "/create",
  auth(UserRole.Employee),
  quizAnswerController.createQuizAnswer
);
router.get("/", quizAnswerController.getAllQuizAnswer);
router.get("/:id", quizAnswerController.getQuizAnswerById);
router.patch("/:id", quizAnswerController.updateQuizAnswer);
router.delete("/:id", quizAnswerController.deleteQuizAnswer);

export const quizAnswerRoutes = router;
