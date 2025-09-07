import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { notificationRoutes } from "../modules/notification/notification.route";
import { competitionRoutes } from "../modules/competition/competition.route";

const router: Router = Router();

const moduleRoutes = [
  { path: "/competition", route: competitionRoutes },
  { path: "/notification", route: notificationRoutes },
  { path: "/auth", route: authRoutes },
  { path: "/user", route: userRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
