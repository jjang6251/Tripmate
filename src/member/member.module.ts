import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Participants } from 'src/participants/participant.entity';
import { Trip } from 'src/trips/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Participants, Trip])],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService]
})
export class MemberModule {}
