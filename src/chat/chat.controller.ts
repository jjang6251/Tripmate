import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @UseGuards(AuthGuard)
    @Get(':room')
    async findAll(@Param('room') room: string): Promise<Chat[]> {
        return this.chatService.findAll(room);
    }

    @Get('/participants/:trip_id')
    getParticipants(@Param('trip_id') tripId: number,) {
        return this.chatService.getParticipants(tripId);
    }

}
