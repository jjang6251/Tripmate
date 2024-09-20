import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';
import { Member } from './member/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'tripmate',
      entities: [Member],
      synchronize: true,
    }),
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
