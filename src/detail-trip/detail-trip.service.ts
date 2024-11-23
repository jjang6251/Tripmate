import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailTrip } from './detail-trip.entity';
import { Repository } from 'typeorm';
import { CreateDetailTripDto } from './dto/createDetailTrip.dto';

@Injectable()
export class DetailTripService {
    constructor(
        @InjectRepository(DetailTrip)
        private detailTripRepository: Repository<DetailTrip>
    ) { }

    //일차별 상세 여행 계획 조회
    async getDetailTrip(tripId: number, day: number): Promise<DetailTrip[]> {
        const findTrip = this.detailTripRepository.find({
            where: {
                tripId: tripId,
                day: day,
            },
            order: {order: 'DESC'}
        });
        return findTrip;
    }

    async createDetailTrip(createDetailTrip: CreateDetailTripDto) {
        try {

            console.log(createDetailTrip);
            const createData = await this.detailTripRepository.create(createDetailTrip);
            return await this.detailTripRepository.save(createData);
        } catch (error) {
            console.log(error);
        }
    }

    async updateOrder(id: number, order: number): Promise<void> {
        try {
            await this.detailTripRepository.update(id, { order });
        } catch (error) {
            console.log(error);
        }
    }

    async deleteDetailTrip(id: number) {
        try {
            await this.detailTripRepository.delete(id);
        } catch (error) {
            console.log(error);
        }
    }

}
