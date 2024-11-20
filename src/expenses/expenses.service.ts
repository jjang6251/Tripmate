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
  //전체 경비, 1일차 경비, 2일차 경비 가져오기
  async getExpensesByDay(tripId: number, day: number): Promise<Expense[]> {
    // day를 사용하여 경비 필터링 로직을 작성합니다.
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });

    if (!trip) {
      throw new Error(`Trip with ID ${tripId} not found`);
    }

    // 여행 시작 날짜에 day를 더한 날짜 계산
    const startDate = new Date(trip.start_date); // 여행 시작 날짜
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + (day - 1)); // day에 맞춰 날짜 계산 (1일차는 시작일 그대로)

    // targetDate와 일치하는 경비 찾기
    return await this.expenseRepository.find({
      where: {
        trip: { id: tripId },
        date: targetDate.toISOString().split('T')[0], // yyyy-mm-dd 형식으로 맞춤
      },
    });
  }

  //며칠까지 있는 지 계산
  async getTripDate(tripId: number): Promise<number> {
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });

    if (!trip) {
      throw new Error('Trip not found');
    }
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    // 날짜 차이를 일 단위로 계산합니다.
    const durationInDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil(durationInDays + 1);
  }

  async editExpense(
    expenseId: number,
    expenseData: CreateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    Object.assign(expense, expenseData);
    return this.expenseRepository.save(expense);
  }

  // 경비 생성 메서드
  async createExpense(
    tripId: number,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });

    if (!trip) {
      throw new Error('Trip not found');
    }

    // 여행 시작 날짜를 기준으로 day를 추가해 date 값을 계산
    const date = new Date(trip.start_date);
    date.setDate(date.getDate() + (createExpenseDto.day - 1));
    const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 저장

    // 데베에 추가
    const expense = this.expenseRepository.create({
      trip, // trip도 올바르게 처리되도록
      price: Number(createExpenseDto.price),
      category: createExpenseDto.category,
      description: createExpenseDto.description,
      date: formattedDate, // 계산된 date를 문자열로 처리
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
