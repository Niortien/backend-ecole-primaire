import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Eleve } from '../eleves/eleve.entity';
import { Classe } from '../classes/classe.entity';
import { User } from '../users/user.entity';

export enum StatutPresence {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  RETARD = 'RETARD',
  EXCUSE = 'EXCUSE',
}

@Entity('presences')
export class Presence {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Eleve, { eager: true, nullable: false })
  @JoinColumn({ name: 'eleve_id' })
  eleve!: Eleve;

  @ManyToOne(() => Classe, { eager: true, nullable: false })
  @JoinColumn({ name: 'classe_id' })
  classe!: Classe;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'enum', enum: StatutPresence, default: StatutPresence.PRESENT })
  statut!: StatutPresence;

  @Column({ nullable: true })
  motif!: string;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
