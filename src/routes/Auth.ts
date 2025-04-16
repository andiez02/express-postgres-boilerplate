import express from 'express';
import { validate } from 'express-validation';
import AuthController from '../controllers/Auth';
import wrapper from '../common/helpers/wrapper';
import validators from '../validators/Auth';
import authentication from '../middlewares/authentication';
import permit from '../middlewares/authorization';
import { Role } from '../common/enum';

const router = express.Router();

/**
 * User login
 */
router.post('/login', validate(validators.login), wrapper(AuthController.login));

/**
 * User signup
 */
router.post('/signup', validate(validators.signUp), wrapper(AuthController.signUp));

/**
 * User sent verify mail if not verified
 */
router.post('/send-verify', validate(validators.sendVerifyMail), wrapper(AuthController.sendVerifyMail));

/**
 * User verify mail from link
 */
router.post('/verify', validate(validators.verifyAccount), wrapper(AuthController.verifyAccount));

/**
 * User invite
 */
router.post('/invite', validate(validators.inviteUser), [authentication, permit(Role.ADMIN)], wrapper(AuthController.inviteUser));

/**
 * Invitee verify
 */
router.post('/verify-invite', validate(validators.verifyInviteAccount), wrapper(AuthController.verifyInviteAccount));

/**
 * Request reset password
 */
router.post('/request-reset-password', validate(validators.requestResetPassword), wrapper(AuthController.requestResetPassword));

/**
 * Reset password
 */
router.post('/reset-password', validate(validators.resetPassword), wrapper(AuthController.resetPassword));

export default router;
