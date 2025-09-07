import { Router } from "express";
import { quizQuestionController } from "./quizQuestion.controller";

const router: Router = Router();

router.post("/", quizQuestionController.createQuizQuestion);
router.get("/", quizQuestionController.getAllQuizQuestion);
router.get("/:id", quizQuestionController.getQuizQuestionById);
router.patch("/:id", quizQuestionController.updateQuizQuestion);
router.delete("/:id", quizQuestionController.deleteQuizQuestion);

export const quizQuestionRoutes = router;