import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/member/entities/member.entity';
import { Trip } from 'src/trips/trip.entity';
import { Participants } from './participant.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Member, Participants]), AuthModule],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
