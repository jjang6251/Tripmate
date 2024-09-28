import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';
import { Member } from './member/entities/member.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { typeORMConfig } from './config/typerorm.config';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(typeORMConfig),
    MemberModule,
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ChatGateway],
})
export class AppModule { }
