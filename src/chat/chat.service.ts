import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './chat.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Participants } from 'src/participants/participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('Chat') private readonly chatModel: Model<Chat>,
        @InjectRepository(Participants)
        private participantsRepository: Repository<Participants>,
    ) { }

    async create(chat: Chat): Promise<Chat> {
        const newChat = new this.chatModel(chat);
        return newChat.save();
    }

    async findAll(room: string): Promise<Chat[]> {
        return this.chatModel.find({ room: room }).exec();
    }

    async getParticipants(tripId: number) {
        return this.participantsRepository.find({where: {trip_id: tripId}});
    }
}
