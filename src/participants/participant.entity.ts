import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { Member } from 'src/member/entities/member.entity';
import { Trip } from 'src/trips/trip.entity';

@Entity('participants')
export class Participants {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trip, (trip) => trip.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => Member, (member) => member.participations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member; // 회원 인덱스

  @Column()
  room_number: number; // 방 번호를 저장하는 컬럼

  @Column()
  userid: string; // userid , 닉네임 columns
}
