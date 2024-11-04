import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from 'src/member/member.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WsJwtGuard } from './chat.guard';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participants } from 'src/participants/participant.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Participants]),
        MemberModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET_KEY'),
                signOptions: { expiresIn: '10h' },
            })
        }),
        MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    ],
    providers: [ WsJwtGuard, ChatGateway, ChatService, AuthGuard],
    controllers: [ChatController],
    exports: [JwtModule],
})
export class ChatModule {

}
