import { Request, Response } from 'express';
import AuthServices from '../services/Auth';
import { generateToken } from '../common/lib/passports';
import AuthRepository from '../repositories/auth';
import UnauthorizedError from '../common/errors/types/UnauthorizedError';
import BadRequestError from '../common/errors/types/BadRequestError';
import messages from '../common/messages';
import UserRepository from '../repositories/user';
import response from '../common/helpers/response';
import { UserAttributes } from '../interfaces/User';

class AuthController extends AuthServices {
  public signUp = async (req: Request, res: Response) => {
    const user: UserAttributes = await this.createUser(req.body);
    await this.sendEmailVerification(user.email, user.token);

    response.success(res);
  };

  public sendVerifyMail = async (req: Request, res: Response) => {
    const user: UserAttributes = await UserRepository.getByEmail(req.body.email);
    if (user.isVerified) {
      throw new BadRequestError('Email was verified');
    }
    await this.sendEmailVerification(user.email, user.token);

    response.success(res);
  };

  public verifyAccount = async (req: Request, res: Response) => {
    const user = await this.verifyEmail(req.body.token);

    if (user) {
      response.success(res);
    } else {
      throw new UnauthorizedError(messages.auth.invalidToken);
    }
  };

  public inviteUser = async (req: Request, res: Response) => {
    const user = await this.inviteNewUser({ inviter: req.user, userData: req.body });

    if (user) {
      this.sendInviteEmailVerification(user.email, user.token);

      response.success(res);
    } else {
      throw new BadRequestError(messages.auth.userExists);
    }
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userData = await AuthRepository.checkAuthentication(email, password);
    if (userData) {
      const token = generateToken(userData);

      response.success(res, token);
    } else {
      throw new BadRequestError(messages.auth.failed);
    }
  };

  public verifyInviteAccount = async (req: Request, res: Response) => {
    const { username, token, password } = req.body;
    const user = await this.verifyInviteEmail({ username, token, password });

    if (user) {
      response.success(res);
    } else {
      throw new UnauthorizedError(messages.auth.invalidToken);
    }
  };

  public requestResetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await this.sendRequestResetPassWord(email);
    await this.sendEmailResetPassWord(user.email, user.token);

    response.success(res);
  };

  public resetPassword = async (req: Request, res: Response) => {
    const user = await this.resetNewPassword(req.body);
    if (user) {
      response.success(res);
    } else {
      throw new UnauthorizedError(messages.auth.invalidToken);
    }
  };
}

export default new AuthController();
