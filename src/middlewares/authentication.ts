import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import messages from '../common/messages';
import UnauthorizedError from '../common/errors/types/UnauthorizedError';

export default (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', {}, (error, data, info) => {
    if (error) {
      return next();
    }

    if (data && data.user) {
      req.user = data.user.dataValues;
      res.locals = res.locals || {};
      res.locals.user = data.user;

      return next();
    }

    return next(new UnauthorizedError(messages.auth.invalidToken));
  })(req, res, next);
};
