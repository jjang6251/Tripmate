import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
// import { Expense } from '../../getPostExpense/expense.entity';
// import { Expense } from 'src/expenses/expenses.entity';
import { Member } from 'src/member/entities/member.entity';
import { Participants } from 'src/participants/participant.entity';
import { Expense } from '../expenses/expenses.entity';
@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Expense, (expense) => expense.trip) // 1:N 관계
  expenses: Expense[];

  // @ManyToOne((type) => Member, (member) => member.trips)
  // member: Member;

  @ManyToOne(() => Member, (member) => member.trips, { eager: true })
  @JoinColumn({ name: 'memberId' }) // 외래 키 컬럼 명시적으로 설정
  member: Member;

  @OneToMany(() => Participants, (participants) => participants.trip)
  participants: Participants[];
}
