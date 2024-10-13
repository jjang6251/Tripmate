import { Document } from 'mongoose';

export interface Chat extends Document {
  readonly room: string;
  readonly content: string;
  readonly sender: string;
  readonly createdAt: Date;
}