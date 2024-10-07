import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Participants } from './participant.entity';
import { Member } from 'src/member/entities/member.entity';
import { Trip } from 'src/trips/trip.entity';
import { CreateParticipantsDto } from './dto/create-participant.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { v1 as uuid } from 'uuid';

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
    inviterId: Member,
  ): Promise<void> {
    // 해당 여행을 찾습니다.
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      // 여행이 없으면 예외 발생
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    
  // 초대하려는 사용자가 해당 여행(tripId)에 속해 있는지 확인
  if (!inviterId || !inviterId.id) {
    throw new UnauthorizedException('초대 권한이 없습니다.');
  }

  const existingParticipant = await this.participantsRepository.findOne({
    where: {
      trip: { id: tripId },
      member: { id: inviterId.id },  // userid 대신 id 사용
    },
  });

  if (!existingParticipant) {
    throw new UnauthorizedException('You do not have permission to invite members to this trip.');
  }
    // 여행에 초대할 회원을 찾습니다.
    const members = await this.membersRepository.find({
      where: {
        userid: In(createParticipantsDto.memberIds),
      },
    });

    if (members.length !== createParticipantsDto.memberIds.length) {
      throw new NotFoundException('Some members were not found');
    }

    // 방 번호를 여행(trip_id)에 맞춰 설정
    // const roomNumber = tripId; // tripId를 방 번호로 사용

    // 각각의 회원을 participants 테이블에 추가
    for (const member of members) {
      const participant = this.participantsRepository.create({
        trip: trip,
        member: member,
        userid: member.userid, // 사용자 닉네임 추가
        // room_number: roomNumber, // 여행 번호(tripId)를 방 번호로 사용
      });
      console.log(`Successfully invited ${member.userid}`);
      await this.participantsRepository.save(participant);
    }
  }
}
