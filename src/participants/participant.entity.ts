import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';
import { Member } from 'src/member/entities/member.entity';
import { Trip } from 'src/trips/trip.entity';

@Entity('participants')
export class Participants {
  @PrimaryColumn()
  trip_id: number; // 기본키의 일부로 사용

  @PrimaryColumn()
  member_id: number; // 기본키의 일부로 사용

  @ManyToOne(() => Trip, (trip) => trip.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => Member, (member) => member.participations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  // @Column()
  // room_number: number;  // 방 번호

  @Column()
  userid: string; // 사용자 ID 또는 닉네임
}
