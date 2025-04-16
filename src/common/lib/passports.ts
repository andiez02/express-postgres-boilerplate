import passportJWT from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { PassportStatic } from 'passport';
import env from '../../../config/env';
import UserRepository from '../../repositories/user';
import { UserAttributes } from '../../interfaces/User';
import ForbiddenError from '../errors/types/ForbiddenError';

export interface JWTPayload {
  sub: string;
  iss: string;
  email: string;
}

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;
const TOKEN_SIGN_ALGORITHM = 'HS256';

export function passportConfiguration(passport: PassportStatic) {
  const opts: passportJWT.StrategyOptions = {
    secretOrKey: env.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  };

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, cb) => {
      const user = await UserRepository.getById(jwtPayload.id);

      if (user) {
        cb(null, { user } as any);
      } else {
        cb(new Error('Something wrong in token'), false);
      }
    })
  );
}

export function generateToken(user: UserAttributes) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export const VerifyType = {
  RESET_PASSWORD: 'ResetPassWord',
  INVITE_ACCOUNT: 'InviteAccount',
  VERIFY_ACCOUNT: 'VerifyAccount',
};

export const generateVerifyToken = ({ email, sub, expiresIn }: { email: string; sub: string; expiresIn: string }) => {
  try {
    const options: jwt.SignOptions = { expiresIn, algorithm: TOKEN_SIGN_ALGORITHM };
    const payload: JWTPayload = {
      sub,
      iss: env.appName,
      email,
    };
    return jwt.sign(payload, env.jwtSecret, options);
  } catch (error) {
    throw new ForbiddenError();
  }
};

export const verifyVerificationToken = ({ token, subject }: { token: string; subject: string }) => {
  const options: jwt.VerifyOptions = {
    subject,
    issuer: env.appName,
    algorithms: [TOKEN_SIGN_ALGORITHM],
  };
  try {
    return jwt.verify(token, env.jwtSecret, options) as JWTPayload;
  } catch (error) {
    throw new ForbiddenError();
  }
};
