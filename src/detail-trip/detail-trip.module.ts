import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/trips/trip.entity';
import { TripsModule } from 'src/trips/trip.module';
import { DetailTrip } from './detail-trip.entity';
import { DetailTripService } from './detail-trip.service';
import { DetailTripGateway } from './detail-trip.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([DetailTrip, Trip]), TripsModule],
    providers: [DetailTripService, DetailTripGateway],
})
export class DetailTripModule {
}
