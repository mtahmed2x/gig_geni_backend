import { Router } from "express";
import { contactController } from "./contact.controller";

const router: Router = Router();

router.get("/", contactController.getAllContact);
router.patch("/update/:id", contactController.updateContact);

export const contactRoutes = router;
