import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NiveauMatiere {
  MATERNELLE = 'MATERNELLE',
  PRIMAIRE = 'PRIMAIRE',
  TOUS = 'TOUS',
}

@Entity('matieres')
export class Matiere {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string; // ex: "Français", "Mathématiques"

  @Column({ unique: true })
  code!: string; // ex: "FR", "MATH"

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 1 })
  coefficient!: number;

  @Column({ type: 'enum', enum: NiveauMatiere, default: NiveauMatiere.TOUS })
  niveau!: NiveauMatiere;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
