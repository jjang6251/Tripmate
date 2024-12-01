import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expenses.entity';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}
  @Post(':trip_id')
  createExpense(
    @Param('trip_id') tripId: number, // tripId 가져오기
    @Body() createExpenseData: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.createExpense(tripId, createExpenseData); // tripId 추가
  }
  //처음 들어갈 때는 다 보여주고
  @Get(':tripId/total')
  getExpenses(@Param('tripId') tripId: number) {
    // 해당 tripId에 대한 경비 데이터를 가져옵니다.
    // return this.expensesService.getExpensesByTrip(tripId);
    return this.expensesService.getTotalExpenseByTrip(tripId);
  }
}
