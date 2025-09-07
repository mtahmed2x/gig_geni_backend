import { Router } from "express";
import { competitionController } from "./competition.controller";
import fileUpload from "express-fileupload";
import fileHandler from "../../middlewares/fileHandler";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";

const router: Router = Router();

router.post(
  "/",
  fileUpload(),
  fileHandler,
  auth(UserRole.Employee),
  competitionController.createCompetition
);
router.get("/", competitionController.getAllCompetition);
router.get(
  "/:id",
  auth(UserRole.Employee),
  competitionController.getCompetitionById
);
router.patch(
  "/:id",
  fileUpload(),
  fileHandler,
  auth(UserRole.Employee),
  competitionController.updateCompetition
);
router.delete(
  "/:id",
  auth(UserRole.Employee),
  competitionController.deleteCompetition
);

export const competitionRoutes = router;
