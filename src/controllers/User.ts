import { Request, Response } from 'express';
import response from '../common/helpers/response';
import UserRepository from '../repositories/user';

class UserController {
  public getMe = async (req: Request, res: Response) => {
    const user = await UserRepository.getById(req.user.id);
    response.success(res, user);
  };

  public autoSuggestion = async (req: Request, res: Response) => {
    const { searchKey: key } = req.query;
    const users = await UserRepository.getSuggestion({ key });
    response.success(res, users);
  };
}

export default new UserController();
