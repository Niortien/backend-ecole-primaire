import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('caisse')
export class Caisse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date', unique: true })
  date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  soldeOuverture!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEntrees!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSorties!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  soldeFermeture!: number;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'comptable_id' })
  comptable!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
