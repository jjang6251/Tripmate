import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './chat.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('Chat') private readonly chatModel: Model<Chat>
    ) {}

    async create(chat: Chat): Promise<Chat> {
        const newChat = new this.chatModel(chat);
        return newChat.save();
    }

    async findAll(room: string): Promise<Chat[]> {
        return this.chatModel.find({ room: room }).exec();
    }
}
