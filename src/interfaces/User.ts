import { Role } from '../common/enum';

export interface UserAttributes {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  isVerified: boolean;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  role: Role;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
