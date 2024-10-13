import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';
import { Member } from './member/entities/member.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeORMConfig } from './config/typerorm.config';
import { ChatGateway } from './chat/chat.gateway';
import { TripsModule } from './trips/trip.module';
import { Expense } from './expenses/expense.entity';
import { ExpensesModule } from './expenses/expense.module';
import { Participants } from './participants/participant.entity';
import { ParticipantsModule } from './participants/participants.module';
import { ChatModule } from './chat/chat.module';
import { WsJwtGuard } from './chat/chat.guard';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeORMConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(`MONGO_URI`),
      }),
      inject: [ConfigService],
    }),
    MemberModule,
    AuthModule,
    TripsModule,
    ExpensesModule,
    ParticipantsModule,
    ChatModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
