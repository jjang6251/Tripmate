import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Trip } from 'src/trips/trip.entity';
import { ExpensesGateway } from './expenses.gateway'; // WebSocket Gateway 추가
import { Expense } from './expenses.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    // @Inject(forwardRef(() => ExpensesGateway)) // forwardRef를 사용하여 순환 참조 해결
    // private expensesGateway: ExpensesGateway,
  ) {}

  // 경비 생성 메서드
  async createExpense(
    tripId: number,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });

    // 데베에 추가
    const expense = this.expenseRepository.create({
      trip, // trip도 올바르게 처리되도록
      price: Number(createExpenseDto.price),
      category: createExpenseDto.category,
      description: createExpenseDto.description,
      date: createExpenseDto.date, // date는 문자열로 처리
    });

    return await this.expenseRepository.save(expense);
  }

  // 경비 조회 Get 메서드
  async getExpensesByTrip(tripId: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { trip: { id: tripId } },
    });
  }

  //경비 삭제 메서드
  async deleteExpense(expenseId: number): Promise<Expense | null> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
    });

    if (!expense) {
      return null; // 경비가 존재하지 않으면 null 반환
    }

    await this.expenseRepository.remove(expense); // 경비 삭제
    return expense; // 삭제된 경비 반환
  }

  // 총합 계산 메서드
  async getTotalExpenseByTrip(tripId: number): Promise<number> {
    const expenses = await this.expenseRepository.find({
      where: { trip: { id: tripId } },
    });

    // 가격을 숫자로 변환하여 총합을 계산
    const total = expenses.reduce(
      (sum, expense) => sum + Number(expense.price),
      0,
    );
    return total;
  }
}
