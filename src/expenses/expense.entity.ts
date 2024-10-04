import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trip } from '../trips/trip.entity';
import { ExpenseCategory } from './expense-category.enum';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trip, (trip) => trip.expenses) // 외래 키 설정
  trip: Trip;

  @Column('decimal')
  price: number;

  @Column({
    type: 'enum',
    enum: ExpenseCategory,
    default: ExpenseCategory.etc,
  })
  category: ExpenseCategory;

  @Column()
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
