import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';
import { Member } from './member/entities/member.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { typeORMConfig } from './config/typerorm.config';
import { ChatGateway } from './chat/chat.gateway';
import { TripsModule } from './trips/trip.module';
// import { Expense } from '../getPostExpense/expense.entity';
import { Expense } from './expenses/expenses.entity';
// import { ExpensesModule } from '../getPostExpense/expense.module';
import { Participants } from './participants/participant.entity';
import { ParticipantsModule } from './participants/participants.module';
import { ExpensesGateway } from './expenses/expenses.gateway';
import { join } from 'path';
import { ExpensesModule } from './expenses/expenses.module';
// import { RealExpensesGateway } from './realExpenses/realExpense.gateway';
// import { RealExpenseModule } from './realExpenses/realExpense.module';
// import { RealExpenseModule } from './realExpenses/realExpense.module';
// import { RealExpenseService } from './realExpenses/realExpense.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeORMConfig),
    MemberModule,
    AuthModule,
    TripsModule,
    ExpensesModule,
    ParticipantsModule,
    // RealExpenseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ChatGateway],
})
export class AppModule {}
