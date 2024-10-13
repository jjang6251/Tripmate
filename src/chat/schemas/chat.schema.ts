import * as mongoose from 'mongoose';


export const ChatSchema = new mongoose.Schema({
  room: String,
  content: String,
  sender: String,
  createdAt: Date,
});