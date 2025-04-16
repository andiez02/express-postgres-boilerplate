import { Op } from 'sequelize';
import UserModel from '../models/User';

class UserRepository {
  async getById(id: string, safe = true) {
    return UserModel.findOne({
      where: { id },
      attributes: { exclude: safe ? ['password', 'token'] : [] },
    });
  }

  async getByEmailOrUsername(email: string, username: string, safe = true) {
    return UserModel.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
      attributes: { exclude: safe ? ['password', 'token'] : [] },
    });
  }

  async getByEmail(email: string, safe = true) {
    return UserModel.findOne({
      where: { email },
      attributes: { exclude: safe ? ['password', 'token'] : [] },
    });
  }

  async getSuggestion({ key }) {
    return UserModel.findAll({
      where: { [Op.or]: [{ email: { [Op.iLike]: `${key}%` }, username: { [Op.iLike]: `${key}%` } }], isVerified: true },
      attributes: { exclude: ['password', 'token'] },
    });
  }
}

export default new UserRepository();
