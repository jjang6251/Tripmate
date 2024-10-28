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
// import { Expense } from '../getPostExpense/expense.entity';
import { Expense } from './expenses/expenses.entity';
// import { ExpensesModule } from '../getPostExpense/expense.module';
import { Participants } from './participants/participant.entity';
import { ParticipantsModule } from './participants/participants.module';

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
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
