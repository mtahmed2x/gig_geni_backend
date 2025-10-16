import { Router } from "express";
import { homeController } from "./home.controller";

const router: Router = Router();

router.post("/", homeController.createHome);
router.get("/", homeController.getAllHome);
router.get("/:id", homeController.getHomeById);
router.patch("/:id", homeController.updateHome);
router.delete("/:id", homeController.deleteHome);

export const homeRoutes = router;