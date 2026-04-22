import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Eleve } from '../eleves/eleve.entity';
import { Classe } from '../classes/classe.entity';
import { AnneeScolaire } from '../annee-scolaire/annee-scolaire.entity';
import { Periode } from '../notes/note.entity';

@Entity('bulletins')
export class Bulletin {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Eleve, { eager: true, nullable: false })
  @JoinColumn({ name: 'eleve_id' })
  eleve!: Eleve;

  @ManyToOne(() => Classe, { eager: true, nullable: false })
  @JoinColumn({ name: 'classe_id' })
  classe!: Classe;

  @ManyToOne(() => AnneeScolaire, { eager: true, nullable: false })
  @JoinColumn({ name: 'annee_scolaire_id' })
  anneeScolaire!: AnneeScolaire;

  @Column({ type: 'enum', enum: Periode })
  periode!: Periode;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  moyenne!: number;

  @Column({ nullable: true })
  rang!: number;

  @Column({ nullable: true })
  appreciation!: string;

  @Column({ default: false })
  publie!: boolean;

  @Column({ nullable: true })
  pdfUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
