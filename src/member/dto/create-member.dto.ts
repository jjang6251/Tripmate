import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ description: '유저 아이디', example: 'user123' })
  readonly userid: string;
  @ApiProperty({ description: '유저 비밀번호', example: 'pass123' })
  readonly password: string;
  @ApiProperty({ description: '유저 이메일', example: 'yoon@gmail.com' })
  readonly useremail: string;
}
