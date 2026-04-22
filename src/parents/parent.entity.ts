import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('parents')
export class Parent {
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
  telephoneUrgence!: string;

  @Column({ nullable: true })
  profession!: string;

  @Column({ nullable: true })
  adresse!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
