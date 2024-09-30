import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString, IsEnum } from 'class-validator';
import { ExpenseCategory } from './expense-category.enum';

export class CreateExpenseDto {
  @ApiProperty({ description: '가격', example: '3000' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '카테고리', example: '식비' })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ description: '상세 내용', example: '갈치 조림' })
  @IsString()
  description: string;

  @ApiProperty({ description: '음식 날짜', example: 'yyyy-mm-dd' })
  @IsDateString()
  date: Date;
}
