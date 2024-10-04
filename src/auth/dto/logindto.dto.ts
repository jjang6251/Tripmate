import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description:'유저 아이디', example: 'user123' })
  readonly userid: string;
  @ApiProperty({ description: '유저 비밀번호', example: 'pass123' })
  readonly password: string;
}
