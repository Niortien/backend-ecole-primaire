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
import { AnneeScolaire } from '../annee-scolaire/annee-scolaire.entity';

@Entity('frais_scolarite')
export class FraisScolarite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  libelle!: string; // ex: "Frais d'inscription", "Frais de scolarité T1"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant!: number;

  @ManyToOne(() => Classe, { eager: true, nullable: true })
  @JoinColumn({ name: 'classe_id' })
  classe!: Classe; // null = applicable à toutes les classes

  @ManyToOne(() => AnneeScolaire, { eager: true, nullable: false })
  @JoinColumn({ name: 'annee_scolaire_id' })
  anneeScolaire!: AnneeScolaire;

  @Column({ default: true })
  obligatoire!: boolean;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
