/* eslint-disable */
declare namespace Express {
  interface User {
    id: string;
    email: string;
    username: string;
    password: string;
    role: 'admin' | 'member';
    isVerified?: string;
    token?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface Request {
    user?: User;
  }
}
