import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Trip } from 'src/trips/trip.entity';

@Entity()
export class DetailTrip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tripId: number;

  @Column() //장소 이름
  placeName: string;

  @Column() //도로명 주소
  placeLocation: string;

  @Column() //순서
  order: number;

  @Column() //머무는 시간
  tripTime: string;

  @Column() //일차
  day: number;
}