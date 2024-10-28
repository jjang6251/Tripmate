import {
  IsNumber,
  IsString,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  price: number;

  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  date: string;
}
