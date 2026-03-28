import { Document, Types, Model } from 'mongoose';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  findUserByCredentials: (_email: string, _password: string) =>
    Promise<Document<unknown, any, IUser>>
}

export interface ICard extends Document {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

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
