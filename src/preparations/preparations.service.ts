// src/preparations/preparations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PreparationItem } from './preparation.entity';
import { Repository } from 'typeorm';
import { Trip } from 'src/trips/trip.entity';

@Injectable()
export class PreparationsService {
  // 서비스 로직
  constructor(
    @InjectRepository(PreparationItem)
    private preparationRepository: Repository<PreparationItem>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
  ) {}
  // 준비물 생성
  async createPreparation(
    item: string,
    tripId: string,
  ): Promise<PreparationItem> {
    const trip = await this.tripRepository.findOne({ where: { id: +tripId } });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const preparation = this.preparationRepository.create({
      item,
      trip,
      isChecked: false, // 기본값은 준비되지 않음
    });

    return await this.preparationRepository.save(preparation);
  }

  // 특정 방(여행)의 준비물 목록 가져오기
  async getPreparationsByRoom(tripId: string): Promise<PreparationItem[]> {
    return await this.preparationRepository.find({
      where: { trip: { id: +tripId } },
    });
  }

  //준비물 번호 받아와서 ㅈㄴ비물 삭제
  async deletePreparation(id: number): Promise<void> {
    const preparation = await this.preparationRepository.findOne({
      where: { id },
    });

    if (!preparation) {
      throw new NotFoundException('Preparation item not found');
    }

    await this.preparationRepository.remove(preparation);
  }

  // 준비물 상태 변경
  async togglePreparationStatus(id: number): Promise<PreparationItem> {
    const preparation = await this.preparationRepository.findOne({
      where: { id },
    });

    if (!preparation) {
      throw new NotFoundException('Preparation item not found');
    }

    // 상태 변경
    preparation.isChecked = !preparation.isChecked;
    return await this.preparationRepository.save(preparation);
  }
}
