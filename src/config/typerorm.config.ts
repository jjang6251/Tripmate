import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Member } from 'src/member/entities/member.entity';
import * as dotenv from 'dotenv';
import { Trip } from 'src/trips/trip.entity';
// import { Expense } from 'getPostExpense/expense.entity';
import { Expense } from 'src/expenses/expenses.entity';
import { Participants } from 'src/participants/participant.entity';
import { PreparationItem } from 'src/preparations/preparation.entity';
import { DetailTrip } from 'src/detail-trip/detail-trip.entity';

dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
  dateStrings: true,
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'tripmate',
  entities: [Member, Trip, Expense, Participants, PreparationItem, DetailTrip],
  synchronize: true,
};
