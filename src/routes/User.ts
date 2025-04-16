import express from 'express';
import { validate } from 'express-validation';
import wrapper from '../common/helpers/wrapper';
import authentication from '../middlewares/authentication';
import UserController from '../controllers/User';
import validators from '../validators/User';

const router = express.Router();

router.get('/me', [authentication], wrapper(UserController.getMe));
router.get('/autosuggest', validate(validators.getSuggestion), [authentication], wrapper(UserController.autoSuggestion));

export default router;
