import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Participants } from './participant.entity';
import { Member } from 'src/member/entities/member.entity';
import { Trip } from 'src/trips/trip.entity';
import { CreateParticipantsDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participants)
    private participantsRepository: Repository<Participants>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  // 초대하기 메소드
  async addParticipantsToTrip(
    tripId: number,
    createParticipantsDto: CreateParticipantsDto,
  ): Promise<void> {
    // 해당 여행을 찾습니다.
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    // 요청된 회원 ID를 기반으로 회원들을 찾ㅇ기
    // const members = await this.membersRepository.findByIds(
    //   createParticipantsDto.memberIds,
    // );
    // if (members.length !== createParticipantsDto.memberIds.length) {
    //   throw new NotFoundException('Some members were not found');
    // }

    const members = await this.membersRepository.find({
      where: {
        userid: In(createParticipantsDto.memberIds),
      },
    });

    if (members.length !== createParticipantsDto.memberIds.length) {
      throw new NotFoundException('Some members were not found');
    }

    // 각각의 회원을 participants 테이블에 추가
    for (const member of members) {
      const participant = this.participantsRepository.create({
        trip: trip,
        member: member,
        userid: member.userid, //사용자 닉네임 추가함
        room_number: createParticipantsDto.roomNumber,
        
      });
      await this.participantsRepository.save(participant);
    }
  }
}
