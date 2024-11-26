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
            order: { order: 'ASC' }
        });
        return findTrip;
    }

    async createDetailTrip(createDetailTrip: CreateDetailTripDto) {
        try {
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

    async updateTrip(id: number, updateTripDto: CreateDetailTripDto) {
        const update= {
            placeName: updateTripDto.placeName,
            placeLocation: updateTripDto.placeLocation,
            tripTime: updateTripDto.tripTime
        }
        try {
            await this.detailTripRepository.update({id: id, tripId: updateTripDto.tripId}, update);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteDetailTrip(id: number) {
        try {
            // 삭제할 항목의 정보를 먼저 가져옵니다
            const targetItem = await this.detailTripRepository.findOne({
                where: { id }
            });

            if (!targetItem) {
                return;
            }

            // 삭제 실행
            await this.detailTripRepository.delete(id);

            // 같은 tripId와 day를 가진 항목들 중 
            // 삭제된 항목의 order보다 큰 항목들의 order를 1씩 감소
            await this.detailTripRepository
                .createQueryBuilder()
                .update(DetailTrip)
                .set({
                    order: () => 'order - 1'
                })
                .where('tripId = :tripId', { tripId: targetItem.tripId })
                .andWhere('day = :day', { day: targetItem.day })
                .andWhere('order > :order', { order: targetItem.order })
                .execute();

        } catch (error) {
            console.log(error);
        }
    }

}
