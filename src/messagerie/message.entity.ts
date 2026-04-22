import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'expediteur_id' })
  expediteur!: User;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'destinataire_id' })
  destinataire!: User;

  @Column()
  sujet!: string;

  @Column({ type: 'text' })
  contenu!: string;

  @Column({ default: false })
  lu!: boolean;

  @Column({ nullable: true })
  conversationId!: string; // UUID pour regrouper les échanges

  @CreateDateColumn()
  dateEnvoi!: Date;
}
