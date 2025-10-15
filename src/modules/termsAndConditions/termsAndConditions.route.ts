import { Router } from "express";
import { termsAndConditionsController } from "./termsAndConditions.controller";

const router: Router = Router();

router.get("/", termsAndConditionsController.getAllTermsAndConditions);
router.patch(
  "/update/:id",
  termsAndConditionsController.updateTermsAndConditions
);

export const termsAndConditionsRoutes = router;
