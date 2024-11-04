import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ExpensesGateway } from './expenses.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/trips/trip.entity';
import { Expense } from './expenses.entity';
import { TripsModule } from 'src/trips/trip.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Trip]), TripsModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpensesGateway],
  exports: [ExpensesService, ExpensesGateway], // 필요 시 다른 모듈에서 사용하기 위해 내보내기
})
export class ExpensesModule {}
