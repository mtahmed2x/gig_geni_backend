import { Router } from "express";
import { quizSettingsController } from "./quizSettings.controller";

const router: Router = Router();

router.post("/create", quizSettingsController.createQuizSettings);
router.get("/", quizSettingsController.getAllQuizSettings);
router.get("/:id", quizSettingsController.getQuizSettingsById);
router.patch("/update/:id", quizSettingsController.updateQuizSettings);
router.delete("/delete/:id", quizSettingsController.deleteQuizSettings);

export const quizSettingsRoutes = router;
