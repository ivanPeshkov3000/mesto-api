import { model, Schema } from 'mongoose';
import './user.model';
import { ICard } from '../utils/types';

const Card = model<ICard>('Card', new Schema({
  name: {
    type: String,
    required: [true, 'Необходимо указать название карточки'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: Schema.Types.String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}));

export default Card;
