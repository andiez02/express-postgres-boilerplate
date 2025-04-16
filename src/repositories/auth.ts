import bcrypt from '../common/lib/bcrypt';
import BadRequestError from '../common/errors/types/BadRequestError';
import UserRepository from './user';

class AuthRepository {
  async checkAuthentication(email: string, password: string): Promise<any | undefined> {
    const user = await UserRepository.getByEmail(email, false);

    if (!user || (password && !bcrypt.comparePassword(password, user.password))) {
      return undefined;
    }
    if (!user.isVerified) {
      throw new BadRequestError('User is not verified');
    }
    return user;
  }
}

export default new AuthRepository();
