import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Classe } from '../classes/classe.entity';
import { Matiere } from '../matieres/matiere.entity';
import { Maitre } from '../maitres/maitre.entity';

@Entity('devoirs')
export class Devoir {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titre!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => Matiere, { eager: true, nullable: false })
  @JoinColumn({ name: 'matiere_id' })
  matiere!: Matiere;

  @ManyToOne(() => Classe, { eager: true, nullable: false })
  @JoinColumn({ name: 'classe_id' })
  classe!: Classe;

  @Column({ type: 'date' })
  dateDonnee!: Date;

  @Column({ type: 'date', nullable: true })
  dateRendu!: Date;

  @ManyToOne(() => Maitre, { eager: false, nullable: true })
  @JoinColumn({ name: 'maitre_id' })
  maitre!: Maitre;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
