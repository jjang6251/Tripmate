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

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'varchar', length: 4 }) //char 4글자로 0830
  start_time: string;
  @Column({ type: 'varchar', length: 4 }) //1450 24시간제로 받음
  end_time: string;

  // @Column({ default: false })
  // is_deleted: boolean;

  // @Column()
  // location: string;

  // @CreateDateColumn()
  // create_at: Date;

  // @UpdateDateColumn()
  // updated_at: Date;

  @OneToMany(() => Expense, (expense) => expense.trip) // 1:N 관계
  expenses: Expense[];

  @ManyToOne(() => Member, (member) => member.trips, { eager: true })
  @JoinColumn({ name: 'memberId' }) // 외래 키 컬럼 명시적으로 설정
  member: Member;

  @OneToMany(() => Participants, (participants) => participants.trip)
  participants: Participants[];
}
