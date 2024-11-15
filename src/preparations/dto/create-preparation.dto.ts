import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePreparationDto {
  @IsString()
  @IsNotEmpty()
  item: string; //준비물 이름

  @IsBoolean()
  @IsOptional()
  isDone?: boolean; // 선택적으로 입력받도록 설정
}
