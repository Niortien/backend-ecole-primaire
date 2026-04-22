import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('annees_scolaires')
export class AnneeScolaire {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  libelle!: string; // ex: "2025-2026"

  @Column({ type: 'date' })
  dateDebut!: Date;

  @Column({ type: 'date' })
  dateFin!: Date;

  @Column({ default: false })
  estActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
