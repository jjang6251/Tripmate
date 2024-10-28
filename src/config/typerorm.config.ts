import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Member } from 'src/member/entities/member.entity';
import * as dotenv from 'dotenv';
import { Trip } from 'src/trips/trip.entity';
// import { Expense } from 'getPostExpense/expense.entity';
import { Expense } from 'src/expenses/expenses.entity';
import { Participants } from 'src/participants/participant.entity';

dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'tripmate',
  entities: [Member, Trip, Expense, Participants],
  synchronize: true,
};
