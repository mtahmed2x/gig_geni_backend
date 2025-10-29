import { Router } from 'express';
import { authController } from './auth.controller';
import { auth } from '../../middlewares/auth';

const router: Router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verifyOTP', auth(), authController.verifyOTP);
router.post('/verifyResetOTP', auth({ reset: true }), authController.verifyOTP);
router.post('/refresh', authController.refresh);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', auth(), authController.resetPassword);
router.post('/resendOTP', auth(), authController.resendOTP);
router.post('/logout', auth(), authController.logout);

export const authRoutes = router;
