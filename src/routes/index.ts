import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { notificationRoutes } from "../modules/notification/notification.route";
import { competitionRoutes } from "../modules/competition/competition.route";
import { quizQuestionRoutes } from "../modules/quizQuestion/quizQuestion.route";
import { contactRoutes } from "../modules/contact/contact.route";
import { privacyPolicyRoutes } from "../modules/privacyPolicy/privacyPolicy.route";
import { termsAndConditionsRoutes } from "../modules/termsAndConditions/termsAndConditions.route";
import { adminDashboardRoutes } from "../modules/adminDashboard/adminDashboard.route";
import { homeRoutes } from "../modules/home/home.route";
import { participantRoutes } from "../modules/participant/participant.route";
import { quizAttemptRoutes } from "../modules/quizAttempt/quizAttempt.route";
import { meetingRoutes } from "../modules/meeting/meeting.route";
import { taskSubmissionRoutes } from "../modules/taskSubmission/taskSubmission.route";

const router: Router = Router();

const moduleRoutes = [
  { path: "/taskSubmission", route: taskSubmissionRoutes },
  { path: "/meeting", route: meetingRoutes },
  { path: "/quizAttempt", route: quizAttemptRoutes },
  { path: "/participant", route: participantRoutes },
  { path: "/home", route: homeRoutes },
  { path: "/adminDashboard", route: adminDashboardRoutes },
  { path: "/termsAndConditions", route: termsAndConditionsRoutes },
  { path: "/privacyPolicy", route: privacyPolicyRoutes },
  { path: "/contact", route: contactRoutes },
  { path: "/quiz-question", route: quizQuestionRoutes },
  { path: "/competition", route: competitionRoutes },
  { path: "/notification", route: notificationRoutes },
  { path: "/auth", route: authRoutes },
  { path: "/user", route: userRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
