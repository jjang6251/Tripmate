import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from '../trips/trip.entity';

@Entity()
export class PreparationItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item: string;

  @Column({ default: false }) 
  isChecked: boolean;
  

  @ManyToOne(() => Trip, (trip) => trip.preparationItems, { onDelete: 'CASCADE' })
  trip: Trip;
}