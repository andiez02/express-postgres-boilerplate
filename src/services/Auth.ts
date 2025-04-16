/* eslint-disable no-undef */
import sequelize from '../common/lib/sequelize';
import bcrypt from '../common/lib/bcrypt';
import UserRepository from '../repositories/user';
import { generateVerifyToken, verifyVerificationToken, VerifyType } from '../common/lib/passports';
import { Role } from '../common/enum';
import messages from '../common/messages';
import constants from '../common/constants';
import env from '../../config/env';
import mail from '../common/lib/mail';
import UnauthorizedError from '../common/errors/types/UnauthorizedError';
import ConflictError from '../common/errors/types/ConflictError';
import BadRequestError from '../common/errors/types/BadRequestError';
import { VerifyInviteEmail } from '../interfaces/Auth';
import ForbiddenError from '../common/errors/types/ForbiddenError';
import { UserAttributes } from '../interfaces/User';
import UserModel from '../models/User';

export default class AuthServices {
  /**
   * Create new user
   * @param  {string} email
   * @param  {string} username
   * @param  {string} password
   * @returns Promise
   */
  async createUser(data: UserAttributes): Promise<UserAttributes | undefined> {
    const user = await UserRepository.getByEmailOrUsername(data.email, data.username);
    data.password = bcrypt.generateHashPassword(data.password);
    const verifyToken = generateVerifyToken({ email: data.email, sub: VerifyType.VERIFY_ACCOUNT, expiresIn: env.jwtVerifyExpiresIn });

    if (!user) {
      let createdOrg;
      let transaction;
      try {
        transaction = await sequelize.transaction();
        const userData = { ...data, role: Role.ADMIN };
        createdOrg = await UserModel.create(userData, { transaction });
        createdOrg.token = verifyToken;
        await transaction.commit();
      } catch (error) {
        if (transaction) {
          await transaction.rollback();
        }
      }
      return createdOrg;
    }

    if (!user.isVerified) {
      await UserModel.update({ password: data.password, updatedAt: new Date() }, { where: { email: data.email } });
      user.token = verifyToken;
      return user;
    }

    if (user) {
      throw new ConflictError('User existed');
    }

    return undefined;
  }

  /**
   * Invite new user
   * @param  {string} email
   * @param  {string} password
   * @returns Promise
   */
  async inviteNewUser({ inviter, userData }: { inviter?: Express.User; userData: UserAttributes }): Promise<UserAttributes | undefined> {
    if (!inviter) {
      throw new UnauthorizedError();
    }
    const user = await UserRepository.getByEmail(userData.email);

    if (!user) {
      const randomString = Math.random().toString(36);
      const randomPassword = randomString.slice(0, 8);
      const randomUsername = randomString.slice(8, 16);
      const inviteToken = generateVerifyToken({ email: userData.email, sub: VerifyType.INVITE_ACCOUNT, expiresIn: env.jwtVerifyExpiresIn });
      userData.username = randomUsername;
      userData.password = bcrypt.generateHashPassword(randomPassword);
      const createdUser = await UserModel.create(userData);
      createdUser.token = inviteToken;
      return createdUser;
    }

    return undefined;
  }

  /**
   * Send invite verification via email
   * @param  {string} email
   * @param  {string} verifyToken
   * @returns Promise
   */
  async sendInviteEmailVerification(email: string, verifyToken: string): Promise<string> {
    const mailOptions = {
      to: email,
      subject: messages.mail.subject.inviteVerification,
      template: constants.mailTemplate.verifyToken,
      data: {
        verifyLink: `${env.clientUrl}/confirm-email?token=${verifyToken}`,
      },
    };

    return mail.requestSendMail(mailOptions);
  }

  /**
   * Send verification via email
   * @param  {string} email
   * @param  {string} verifyToken
   * @returns Promise
   */
  async sendEmailVerification(email: string, verifyToken: string): Promise<string> {
    const mailOptions = {
      to: email,
      subject: messages.mail.subject.verification,
      template: constants.mailTemplate.verifyToken,
      data: {
        verifyLink: `${env.clientUrl}/verify-account?token=${verifyToken}`,
      },
    };

    return mail.requestSendMail(mailOptions);
  }

  /**
   * Send mail reset password
   * @param  {string} email
   * @param  {string} verifyToken
   * @returns Promise
   */
  async sendEmailResetPassWord(email: string, verifyToken: string): Promise<string> {
    const mailOptions = {
      to: email,
      subject: messages.mail.subject.resetPassword,
      template: constants.mailTemplate.verifyToken,
      data: {
        verifyLink: `${env.clientUrl}/reset-password?token=${verifyToken}`,
      },
    };

    return mail.requestSendMail(mailOptions);
  }

  /**
   * Verify account
   * @param  {string} verifyToken
   * @returns Promise
   */
  async verifyEmail(verifyToken: string) {
    const decoded = verifyVerificationToken({ token: verifyToken, subject: VerifyType.VERIFY_ACCOUNT });

    if (decoded) {
      const user = await UserModel.findOne({ where: { email: decoded.email } });

      if (!user || user.isVerified) {
        throw new ForbiddenError();
      }

      await UserModel.update({ isVerified: true, updatedAt: new Date() }, { where: { email: decoded.email } });

      return user;
    }
    return undefined;
  }

  /**
   * Verify invite account
   * @param  {string} username
   * @param  {string} password
   * @param  {string} token
   * @returns Promise
   */
  async verifyInviteEmail({ username, token, password }: VerifyInviteEmail): Promise<UserAttributes | undefined> {
    const decoded = verifyVerificationToken({ token, subject: VerifyType.INVITE_ACCOUNT });

    if (decoded) {
      const user = await UserModel.findOne({ where: { email: decoded.email } });
      const userFindByUsername = await UserModel.findOne({ where: { username } });

      if (userFindByUsername) {
        throw new ConflictError('Username existed');
      }

      if (!user || user.isVerified) {
        throw new ForbiddenError();
      }

      await UserModel.update(
        { username, password: bcrypt.generateHashPassword(password), isVerified: true, updatedAt: new Date() },
        { where: { email: decoded.email } }
      );
      return user;
    }
    return undefined;
  }

  /**
   * Send mail reset password
   * @param  {string} email
   * @returns Promise
   */
  async sendRequestResetPassWord(email: string): Promise<UserAttributes> {
    const user = await UserRepository.getByEmail(email);
    if (!user) {
      throw new UnauthorizedError();
    }
    const verifyToken = generateVerifyToken({
      email: user.email,
      sub: VerifyType.RESET_PASSWORD,
      expiresIn: env.jwtResetPasswordExpiresIn,
    });

    await UserModel.update({ token: verifyToken }, { where: { id: user.id } });

    return { ...user, token: verifyToken };
  }

  /**
   * Reset password
   * @param  {string} token
   * @param  {string} password
   * @returns Promise
   */
  async resetNewPassword(bodyData): Promise<UserAttributes | undefined> {
    const { token, password } = bodyData;

    const decoded = verifyVerificationToken({ token, subject: VerifyType.RESET_PASSWORD });

    if (decoded) {
      const user = await UserModel.findOne({ where: { email: decoded.email } });
      if (user && (!user.token || user.token !== token)) {
        throw new BadRequestError('Your verify link has expired');
      }

      if (!user) {
        throw new UnauthorizedError();
      }

      await UserModel.update(
        { password: bcrypt.generateHashPassword(password), token: null, updatedAt: new Date() },
        { where: { email: decoded.email } }
      );
      return user;
    }
    return undefined;
  }
}
