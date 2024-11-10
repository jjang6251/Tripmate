import {
  IsNumber,
  IsString,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  price: number;

  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @IsNotEmpty()
  // date: string;

  @IsNotEmpty()
  day: number; // 추가된 day 필드
}
