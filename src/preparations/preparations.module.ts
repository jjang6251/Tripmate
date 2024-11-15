// src/preparations/preparations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreparationItem } from './preparation.entity';
import { TripsModule } from '../trips/trip.module'; // TripsModule 추가
import { PreparationsService } from './preparations.service';
import { PreparationsGateway } from './preparations.gateway';
import { Trip } from 'src/trips/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreparationItem, Trip]), TripsModule],
  providers: [PreparationsService, PreparationsGateway],
  exports: [PreparationsService],
})
export class PreparationsModule {}
