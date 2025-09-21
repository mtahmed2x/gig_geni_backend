import { Router } from "express";
import { competitionController } from "./competition.controller";
import fileUpload from "express-fileupload";
import fileHandler from "../../middlewares/fileHandler";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../user/user.constant";
import parseData from "../../middlewares/parseData";

const router: Router = Router();

router.post(
  "/create",
  fileUpload(),
  fileHandler,
  parseData(),
  auth(UserRole.Employer),
  competitionController.createCompetition
);

router.post(
  "/:id/join",
  auth(UserRole.Talent),
  competitionController.joinCompetition
);

router.get(
  "/",
  auth(UserRole.Employer, UserRole.Talent),
  competitionController.getAllCompetition
);

router.get(
  "/:id",
  auth(UserRole.Employer, UserRole.Talent),
  competitionController.getCompetitionById
);

router.patch(
  "/:id",
  fileUpload(),
  fileHandler,
  auth(UserRole.Employer),
  competitionController.updateCompetition
);

router.delete(
  "/:id",
  auth(UserRole.Employer),
  competitionController.deleteCompetition
);

export const competitionRoutes = router;
