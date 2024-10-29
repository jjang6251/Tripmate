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
import { CreateMemberDto } from 'src/member/dto/create-member.dto';

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

  //초대할 회원이 멤버 데이터베이스에 있는지 확인
  async findParticipantsInMember(
    searchedname: string,
  ): Promise<Partial<Member>> {
    const foundMembers = []; //초대할 회원들 배열

    const member = await this.membersRepository.findOne({
      where: { userid: searchedname },
    });

    if (member) {
      foundMembers.push(member); // 회원이 존재하면 배열에 추가
      console.log('foundMembers:', foundMembers); // 확인용 로그
      console.log('\n\n\n'); // 확인용 로그
      return {
        userid: member.userid, // 조회한 회원 아이디랑
        useremail: member.useremail, // 이메일만 반환
      };
    } else {
      //없으면 예외 발생
      throw new NotFoundException(
        `초대하려는 사람 (${searchedname})이 데이터베이스에 없습니다.`,
      );
    }
  }

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

    // console.log('여행 정보:', trip);
    // console.log('초대할 회원:', createParticipantsDto.memberIds);
    // console.log('초대자 정보:', inviterId);

    // 해당 여행에 속한 모든 참가자를 조회
    const existingParticipants = await this.participantsRepository.find({
      where: {
        trip: { id: tripId },
      },
    });

    // 초대자가 해당 여행에 속해 있는지 확인
    const inviterIsParticipant = existingParticipants.some(
      (participant) => participant.userid === inviterId.userid,
    );

    console.log('existingParticipants:', existingParticipants); // 확인용 로그

    if (!inviterIsParticipant) {
      console.log('권한이 없는 사용자');
      throw new UnauthorizedException(
        'You do not have permission to invite members to this trip.',
      );
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
