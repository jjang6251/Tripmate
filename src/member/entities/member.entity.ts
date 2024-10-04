import { Participants } from 'src/participants/participant.entity';
import { Trip } from 'src/trips/trip.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  userid: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: false, nullable: false })
  useremail: string;

  // @OneToMany(() => Trip, (trip) => trip.member)
  // trips: Trip[];

  @ManyToMany(() => Trip, (trip) => trip.participants)
  trips: Trip[];

  @OneToMany(() => Participants, (participants) => participants.member)
  participations: Participants[];
}
