import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Classe } from '../classes/classe.entity';

@Entity('maitres')
export class Maitre {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  nom!: string;

  @Column()
  prenom!: string;

  @Column({ nullable: true })
  telephone!: string;

  @Column({ nullable: true })
  diplome!: string;

  @Column({ nullable: true })
  specialite!: string;

  @Column({ type: 'date', nullable: true })
  dateEmbauche!: Date;

  @ManyToMany(() => Classe, { eager: false })
  @JoinTable({ name: 'maitre_classes' })
  classes!: Classe[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
