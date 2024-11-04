import { Module } from '@nestjs/common';
import { TripsService } from './trip.service';
import { TripsController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MemberModule } from 'src/member/member.module';
import { Member } from 'src/member/entities/member.entity';
import { Participants } from 'src/participants/participant.entity';
import { Expense } from 'src/expenses/expenses.entity';
import { ExpensesService } from 'src/expenses/expenses.service';
import { ExpensesGateway } from 'src/expenses/expenses.gateway';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Member, Participants]), AuthModule],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
