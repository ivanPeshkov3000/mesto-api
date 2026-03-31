import { HydratedDocument, Types, Model } from 'mongoose';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export type UserDocument = HydratedDocument<IUser>;

export interface UserModel extends Model<IUser> {
  findUserByCredentials: (_email: string, _password: string) =>
    Promise<UserDocument>
}

export interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

export type CardDocument = HydratedDocument<ICard>;

export interface IHttpError {
  message: string;
}

interface IReqUser {
  _id: string;
  payload?: JwtPayload | string;
}

export interface SessionRequest extends Request {
  user: IReqUser;
}
