import { Router } from "express";
import { taskSubmissionController } from "./taskSubmission.controller";

const router: Router = Router();

router.post("/create", taskSubmissionController.createTaskSubmission);
router.get("/", taskSubmissionController.getAllTaskSubmission);
router.get("/:id", taskSubmissionController.getTaskSubmissionById);
router.patch("/update/:id", taskSubmissionController.updateTaskSubmission);
router.delete("/delete/:id", taskSubmissionController.deleteTaskSubmission);

export const taskSubmissionRoutes = router;