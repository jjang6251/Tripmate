import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantsDto {
  @ApiProperty({ description: '초대할 유저 이름', example: ['yoon123', 'jjang'] })
  @IsArray()
  memberIds: string[];

  // @ApiProperty({ description: 'Room number', example: 1 })
  // @IsNumber()
  // roomNumber: number;
}