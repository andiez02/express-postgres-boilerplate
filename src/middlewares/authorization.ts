import { Request, Response, NextFunction } from 'express';
import ForbiddenError from '../common/errors/types/ForbiddenError';
import { Role } from '../common/enum';

export default function permit(...permittedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (user && permittedRoles.includes((user as any).role)) {
      next();
    } else {
      throw new ForbiddenError('Access denied');
    }
  };
}
