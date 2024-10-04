import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Member } from 'src/member/entities/member.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): Member => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
