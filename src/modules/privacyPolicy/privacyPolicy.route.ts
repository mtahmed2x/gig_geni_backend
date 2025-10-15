import { Router } from "express";
import { privacyPolicyController } from "./privacyPolicy.controller";

const router: Router = Router();

router.get("/", privacyPolicyController.getAllPrivacyPolicy);
router.patch("/update/:id", privacyPolicyController.updatePrivacyPolicy);

export const privacyPolicyRoutes = router;
