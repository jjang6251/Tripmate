import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { Member } from 'src/member/entities/member.entity';
import { Participants } from 'src/participants/participant.entity';
// import { UserRepository } from 'src/auth/user.repository';
// import { User } from 'src/auth/user.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>, // MemberRepository 추가
    @InjectRepository(Participants)
    private participantsRepository: Repository<Participants>, // ParticipantsRepository 추가
  ) {}

  async createTrip(tripData: Partial<Trip>, memberPayload: any): Promise<{ onlyTripData: Partial<Trip>, trip_id: number }> {
    const member = await this.memberRepository.findOne({
      where: { id: memberPayload.sub }, // member.sub을 이용해 데이터베이스에서 조회
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const trip = this.tripsRepository.create({
      ...tripData,
      member: member,
    });
    const onlyTripData = { ...tripData };

    const savedTrip = await this.tripsRepository.save(trip); // 여행 저장

    // 여행 생성자를 Participants 테이블에 추가
    const participant = this.participantsRepository.create({
      trip: savedTrip, // 저장된 여행 정보
      member: member, // 여행 생성자
      userid: member.userid, // 생성자의 사용자 ID
      // room_number: savedTrip.id, // 여행 ID를 방 번호로 설정
    });

    await this.participantsRepository.save(participant); // 생성자를 참가자 테이블에 저장

    return {
      onlyTripData,
      trip_id: savedTrip.id,
    } // 생성된 여행 반환
  }

  //모든 여행 가져오기
  async getAllTrips(memberPayload: any): Promise<Trip[]> {
    // return await this.tripsRepository.find({ where: { member:member,is_deleted: false } });

    const member = await this.memberRepository.findOne({
      where: { id: memberPayload.sub }, // 적절한 필드로 수정 (예: userid)
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return await this.tripsRepository.find({
      where: { member: member, is_deleted: false }, // 해당 회원과 삭제되지 않은 여행만 가져옴
    });
  }

  // 회원이 참여자로 포함된 여행을 가져오는 메소드
  async getTripsForParticipant(member: Member): Promise<Trip[]> {
    // 현재 회원이 참가자로 포함된 여행 정보 가져오기
    const participants = await this.participantsRepository.find({
      where: { userid: member.userid },
      relations: ['trip'], // 관련된 여행 정보도 함께 로드
    });

    // 참가자가 참여한 여행이 없으면 예외 발생
    if (participants.length === 0) {
      throw new NotFoundException('내가 참여한 여행이 없습니다.');
    }

    // 참가자가 참여한 모든 여행 목록 반환
    const trips = participants.map((participant) => participant.trip);
    return trips;
  }

  async updateTrip(id: number, tripData: Partial<Trip>): Promise<Trip> {
    await this.tripsRepository.update(id, tripData);
    const updatedTrip = await this.tripsRepository.findOne({
      where: { id }, // 수정된 부분
    });
    if (!updatedTrip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return updatedTrip;
  }

  async deleteTrip(id: number): Promise<void> {
    const result = await this.tripsRepository.update(id, { is_deleted: true });
    if (result.affected === 0) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
  }
}
