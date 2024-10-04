import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ManyToOne } from 'typeorm';
import { Member } from 'src/member/entities/member.entity';

export class CreateTripDto {
  @ApiProperty({ description: '여행 이름', example: '가족 여행' })
  @IsString()
  name: string;

  @ApiProperty({ description: '여행 위치', example: '부산' })
  @IsString()
  location: string;

  @ApiProperty({ description: '여행 시작 날짜', example: 'yyyy-mm-dd' })
  @IsDateString()
  start_date: Date;

  @ApiProperty({ description: '여행 종료 날짜', example: 'yyyy-mm-dd' })
  @IsDateString()
  end_date: Date;

}
