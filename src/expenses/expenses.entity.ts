import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Trip } from 'src/trips/trip.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  price: number;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  date: string;

  @ManyToOne(() => Trip, (trip) => trip.expenses, { onDelete: 'CASCADE' })
  trip: Trip;

  @Column()
  day: number;
}
