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

  //여행 강퇴
  async expelParticipants(
    expeller: Member, //추방 시키는 사람
    tripId: number, //여행 번호
    expelledname: string, // 강퇴 당할 사람
  ): Promise<void> {
    // 받아온 여행정보, 강퇴당할 사람 찾기
    const participant = await this.participantsRepository.findOne({
      where: { trip: { id: tripId }, userid: expelledname },
    });

    if (!participant) {
      //추방 당할 사람이 없으면 예외 처리
      throw new NotFoundException(
        `여행 ${tripId}에서 ${expelledname} 참가자를 찾을 수 없습니다.`,
      );
    }

    // 자기 자신을 강퇴처리 못하게 예외 처리
    if (expelledname === expeller.userid) {
      throw new UnauthorizedException('자신을 강퇴할 수 없습니다.');
    }

    // 해당 여행이 있는 지 확인하고
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException(`여행 ${tripId}를 찾을 수 없습니다.`);
    }

    // 강퇴자를 participants 테이블에서 삭제
    await this.participantsRepository.remove(participant);
    console.log(
      `여행 ${tripId}에서 ${expelledname} 참가자를 성공적으로 강퇴했습니다.`,
    );
  }

  // 본인이 여행에서 나가기
  async deleteParticipants(escaper: Member, tripId: number): Promise<void> {
    const participant = await this.participantsRepository.findOne({
      where: { trip: { id: tripId }, member: { userid: escaper.userid } },
    });

    console.log(participant); // 확인용 로그
    // 여행에서 참가자를 찾을 수 없으면 예외 처리
    if (!participant) {
      throw new NotFoundException(
        `여행 ${tripId}에서 ${escaper.userid} 참가자를 찾을 수 없습니다.`,
      );
    }

    // 본인이 해당 여행에서 탈주하기
    await this.participantsRepository.remove(participant);
    console.log(
      // 확인용 로그
      `여행 ${tripId}에서 ${escaper.userid} 참가자를 성공적으로 삭제했습니다.`,
    );
  }

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

  async addParticipantsToTrip(
    tripId: number,
    memberIds: string[], // 초대할 회원의 ID 배열
    inviter: Member,
  ): Promise<void> {
    // 여행을 찾습니다.
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException(` ${tripId}번 여행이 없습니다.`);
    }

    // 해당 여행에 이미 속한 모든 참가자를 조회, 중복 막기
    const existingParticipants = await this.participantsRepository.find({
      where: {
        trip: { id: tripId },
      },
    });
    console.log(existingParticipants); // 확인용 로그

    // 초대자가 해당 여행에 속해 있는지 확인
    const inviterIsParticipant = existingParticipants.some(
      (participant) => participant.userid === inviter.userid,
    );

    if (!inviterIsParticipant) {
      // 초대자가 해당 여행에 속해 있지 않으면 예외 처리
      // 그럴 일은 없음... 여행을 만든 사람이라면 무조건 속해 있음
      throw new UnauthorizedException('권한이 없습니다.');
    }

    // 초대할 회원 ID로 회원을 조회. Member데베에 있는 사람만 초대 가능
    const membersToInvite = await this.membersRepository.find({
      where: {
        userid: In(memberIds),
      },
    });

    // 초대할 회원 중 일부가 존재하지 않으면 예외 처리
    if (membersToInvite.length !== memberIds.length) {
      // 이미 조회를 해서 배열에 들어왔으므로 실행될 일은 없을 듯...
      throw new NotFoundException('일부 회원을 찾을 수 없습니다.');
    }

    // 각각의 회원을 participants 테이블에 추가
    for (const member of membersToInvite) {
      const participant = this.participantsRepository.create({
        trip: trip,
        member: member,
        userid: member.userid, // 사용자 닉네임 추가
      });
      await this.participantsRepository.save(participant);
    }
  }
}

// // 초대하기 메소드
// async addParticipantsToTrip(
//   tripId: number,
//   foundMembers: Member[], // 이미 조회된 회원들 배열
//   inviterId: Member,
// ): Promise<void> {
//   // 해당 여행을 찾습니다.
//   const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
//   if (!trip) {
//     // 여행이 없으면 예외 발생
//     throw new NotFoundException(`Trip with ID ${tripId} not found`);
//   }

//   // console.log('여행 정보:', trip);
//   // console.log('초대할 회원:', createParticipantsDto.memberIds);
//   // console.log('초대자 정보:', inviterId);

//   // 해당 여행에 속한 모든 참가자를 조회
//   const existingParticipants = await this.participantsRepository.find({
//     where: {
//       trip: { id: tripId },
//     },
//   });

//   // 초대자가 해당 여행에 속해 있는지 확인
//   const inviterIsParticipant = existingParticipants.some(
//     (participant) => participant.userid === inviterId.userid,
//   );

//   console.log('existingParticipants:', existingParticipants); // 확인용 로그

//   if (!inviterIsParticipant) {
//     console.log('권한이 없는 사용자');
//     throw new UnauthorizedException(
//       'You do not have permission to invite members to this trip.',
//     );
//   }

//   // // 여행에 초대할 회원을 찾습니다.
//   // const members = await this.membersRepository.find({
//   //   where: {
//   //     userid: In(createParticipantsDto.memberIds),
//   //   },
//   // });

//   // if (members.length !== createParticipantsDto.memberIds.length) {
//   //   throw new NotFoundException('Some members were not found');
//   // }

//   // 방 번호를 여행(trip_id)에 맞춰 설정
//   // const roomNumber = tripId; // tripId를 방 번호로 사용

//   // 각각의 회원을 participants 테이블에 추가
//   for (const member of foundMembers) {
//     const participant = this.participantsRepository.create({
//       trip: trip,
//       member: member,
//       userid: member.userid // 사용자 닉네임 추가
//       // room_number: roomNumber, // 여행 번호(tripId)를 방 번호로 사용
//     });
//     console.log(`Successfully invited ${member.userid}`);
//     await this.participantsRepository.save(participant);
//   }
// }
// }
