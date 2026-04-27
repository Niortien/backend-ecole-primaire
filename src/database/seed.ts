import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { Parent } from '../parents/parent.entity';
import { Maitre } from '../maitres/maitre.entity';
import { AnneeScolaire } from '../annee-scolaire/annee-scolaire.entity';
import { Classe, NomClasse, NiveauClasse } from '../classes/classe.entity';
import { Matiere, NiveauMatiere } from '../matieres/matiere.entity';
import { Eleve, Sexe, StatutEleve } from '../eleves/eleve.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'ecole_primaire',
  entities: [User, Parent, Maitre, AnneeScolaire, Classe, Matiere, Eleve],
  synchronize: true,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function hash(plain: string) {
  return bcrypt.hash(plain, 10);
}

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Connecté à la base de données');

  const userRepo = AppDataSource.getRepository(User);
  const parentRepo = AppDataSource.getRepository(Parent);
  const maitreRepo = AppDataSource.getRepository(Maitre);
  const anneeRepo = AppDataSource.getRepository(AnneeScolaire);
  const classeRepo = AppDataSource.getRepository(Classe);
  const matiereRepo = AppDataSource.getRepository(Matiere);
  const eleveRepo = AppDataSource.getRepository(Eleve);

  // ─── 1. Année scolaire ───────────────────────────────────────────────────
  let annee = await anneeRepo.findOne({ where: { libelle: '2025-2026' } });
  if (!annee) {
    annee = anneeRepo.create({
      libelle: '2025-2026',
      dateDebut: new Date('2025-09-02'),
      dateFin: new Date('2026-06-26'),
      estActive: true,
    });
    annee = await anneeRepo.save(annee);
    console.log('📅 Année scolaire 2025-2026 créée');
  }

  // ─── 2. Matières ─────────────────────────────────────────────────────────
  const matieresData = [
    { nom: 'Français', code: 'FR', coefficient: 3, niveau: NiveauMatiere.TOUS },
    { nom: 'Mathématiques', code: 'MATH', coefficient: 3, niveau: NiveauMatiere.TOUS },
    { nom: 'Sciences', code: 'SCI', coefficient: 2, niveau: NiveauMatiere.PRIMAIRE },
    { nom: 'Histoire-Géographie', code: 'HG', coefficient: 2, niveau: NiveauMatiere.PRIMAIRE },
    { nom: 'Éducation Physique', code: 'EPS', coefficient: 1, niveau: NiveauMatiere.TOUS },
    { nom: 'Arts Plastiques', code: 'ART', coefficient: 1, niveau: NiveauMatiere.TOUS },
    { nom: 'Éveil', code: 'EVEIL', coefficient: 1, niveau: NiveauMatiere.MATERNELLE },
  ];

  const matieres: Matiere[] = [];
  for (const m of matieresData) {
    let mat = await matiereRepo.findOne({ where: { code: m.code } });
    if (!mat) {
      mat = await matiereRepo.save(matiereRepo.create(m));
      console.log(`📚 Matière créée : ${m.nom}`);
    }
    matieres.push(mat);
  }

  // ─── 3. Classes ──────────────────────────────────────────────────────────
  const classesData = [
    { nom: NomClasse.PS, libelle: 'Petite Section', niveau: NiveauClasse.MATERNELLE, capacite: 25 },
    { nom: NomClasse.MS, libelle: 'Moyenne Section', niveau: NiveauClasse.MATERNELLE, capacite: 25 },
    { nom: NomClasse.GS, libelle: 'Grande Section', niveau: NiveauClasse.MATERNELLE, capacite: 25 },
    { nom: NomClasse.CP, libelle: 'CP A', niveau: NiveauClasse.PRIMAIRE, capacite: 30 },
    { nom: NomClasse.CE1, libelle: 'CE1 A', niveau: NiveauClasse.PRIMAIRE, capacite: 30 },
    { nom: NomClasse.CE2, libelle: 'CE2 A', niveau: NiveauClasse.PRIMAIRE, capacite: 30 },
    { nom: NomClasse.CM1, libelle: 'CM1 A', niveau: NiveauClasse.PRIMAIRE, capacite: 30 },
    { nom: NomClasse.CM2, libelle: 'CM2 A', niveau: NiveauClasse.PRIMAIRE, capacite: 30 },
  ];

  const classes: Classe[] = [];
  for (const c of classesData) {
    let cls = await classeRepo.findOne({ where: { libelle: c.libelle, anneeScolaire: { id: annee.id } } });
    if (!cls) {
      cls = await classeRepo.save(classeRepo.create({ ...c, anneeScolaire: annee }));
      console.log(`🏫 Classe créée : ${c.libelle}`);
    }
    classes.push(cls);
  }

  // ─── 4. Utilisateurs admin / directeur ───────────────────────────────────
  const adminEmail = 'admin@ecole-primaire.fr';
  let adminUser = await userRepo.findOne({ where: { email: adminEmail } });
  if (!adminUser) {
    adminUser = await userRepo.save(userRepo.create({
      email: adminEmail,
      password: await hash('Admin@2026!'),
      role: UserRole.ADMIN,
    }));
    console.log('👤 Admin créé');
  }

  const directeurEmail = 'directeur@ecole-primaire.fr';
  let directeurUser = await userRepo.findOne({ where: { email: directeurEmail } });
  if (!directeurUser) {
    directeurUser = await userRepo.save(userRepo.create({
      email: directeurEmail,
      password: await hash('Directeur@2026!'),
      role: UserRole.DIRECTEUR,
    }));
    console.log('👤 Directeur créé');
  }

  // ─── 5. Maîtres ──────────────────────────────────────────────────────────
  const maitresData = [
    { email: 'marie.dupont@ecole.fr', nom: 'DUPONT', prenom: 'Marie', telephone: '06 11 22 33 44', diplome: 'CRPE', specialite: 'Maternelle', dateEmbauche: '2018-09-01', classeIndexes: [0, 1, 2] },
    { email: 'paul.martin@ecole.fr', nom: 'MARTIN', prenom: 'Paul', telephone: '06 55 66 77 88', diplome: 'CRPE', specialite: 'CP/CE1', dateEmbauche: '2015-09-01', classeIndexes: [3, 4] },
    { email: 'sophie.bernard@ecole.fr', nom: 'BERNARD', prenom: 'Sophie', telephone: '06 99 88 77 66', diplome: 'CRPE', specialite: 'CE2/CM1', dateEmbauche: '2020-09-01', classeIndexes: [5, 6] },
    { email: 'jean.leroy@ecole.fr', nom: 'LEROY', prenom: 'Jean', telephone: '07 12 34 56 78', diplome: 'CRPE', specialite: 'CM2', dateEmbauche: '2012-09-01', classeIndexes: [7] },
  ];

  const maitres: Maitre[] = [];
  for (const m of maitresData) {
    let mUser = await userRepo.findOne({ where: { email: m.email } });
    if (!mUser) {
      mUser = await userRepo.save(userRepo.create({
        email: m.email,
        password: await hash('Maitre@2026!'),
        role: UserRole.MAITRE,
      }));
    }
    let maitre = await maitreRepo.findOne({ where: { user: { id: mUser.id } } });
    if (!maitre) {
      maitre = await maitreRepo.save(maitreRepo.create({
        user: mUser,
        nom: m.nom,
        prenom: m.prenom,
        telephone: m.telephone,
        diplome: m.diplome,
        specialite: m.specialite,
        dateEmbauche: new Date(m.dateEmbauche),
        classes: m.classeIndexes.map(i => classes[i]),
      }));
      console.log(`🧑‍🏫 Maître créé : ${m.prenom} ${m.nom}`);
    }
    maitres.push(maitre);
  }

  // ─── 6. Parents ──────────────────────────────────────────────────────────
  const parentsData = [
    { email: 'thomas.petit@gmail.com', nom: 'PETIT', prenom: 'Thomas', telephone: '06 10 20 30 40', telephoneUrgence: '06 11 21 31 41', profession: 'Ingénieur', adresse: '12 rue des Lilas, 75001 Paris' },
    { email: 'isabelle.moreau@gmail.com', nom: 'MOREAU', prenom: 'Isabelle', telephone: '06 50 60 70 80', telephoneUrgence: '06 51 61 71 81', profession: 'Infirmière', adresse: '5 avenue Victor Hugo, 75008 Paris' },
    { email: 'nathalie.simon@gmail.com', nom: 'SIMON', prenom: 'Nathalie', telephone: '06 22 33 44 55', telephoneUrgence: '06 23 34 45 56', profession: 'Enseignante', adresse: '8 boulevard Voltaire, 75011 Paris' },
    { email: 'eric.fontaine@gmail.com', nom: 'FONTAINE', prenom: 'Éric', telephone: '07 11 22 33 44', telephoneUrgence: '07 12 23 34 45', profession: 'Comptable', adresse: '3 rue de la Paix, 75002 Paris' },
    { email: 'valerie.rousseau@gmail.com', nom: 'ROUSSEAU', prenom: 'Valérie', telephone: '06 88 99 00 11', telephoneUrgence: '06 89 90 01 12', profession: 'Médecin', adresse: '17 rue Molière, 75001 Paris' },
    { email: 'pascal.lambert@gmail.com', nom: 'LAMBERT', prenom: 'Pascal', telephone: '07 33 44 55 66', telephoneUrgence: '07 34 45 56 67', profession: 'Artisan', adresse: '22 rue du Commerce, 75015 Paris' },
  ];

  const parents: Parent[] = [];
  for (const p of parentsData) {
    let pUser = await userRepo.findOne({ where: { email: p.email } });
    if (!pUser) {
      pUser = await userRepo.save(userRepo.create({
        email: p.email,
        password: await hash('Parent@2026!'),
        role: UserRole.PARENT,
      }));
    }
    let parent = await parentRepo.findOne({ where: { user: { id: pUser.id } } });
    if (!parent) {
      parent = await parentRepo.save(parentRepo.create({
        user: pUser,
        nom: p.nom,
        prenom: p.prenom,
        telephone: p.telephone,
        telephoneUrgence: p.telephoneUrgence,
        profession: p.profession,
        adresse: p.adresse,
      }));
      console.log(`👪 Parent créé : ${p.prenom} ${p.nom}`);
    }
    parents.push(parent);
  }

  // ─── 7. Élèves ───────────────────────────────────────────────────────────
  const elevesData = [
    // CP (classes[3])
    { nom: 'PETIT', prenom: 'Lucas', dateNaissance: '2019-03-15', lieuNaissance: 'Paris', sexe: Sexe.M, numeroDossier: 'EL-001', classeIdx: 3, parentIdx: 0 },
    { nom: 'PETIT', prenom: 'Emma', dateNaissance: '2019-07-22', lieuNaissance: 'Paris', sexe: Sexe.F, numeroDossier: 'EL-002', classeIdx: 3, parentIdx: 0 },
    { nom: 'MOREAU', prenom: 'Noah', dateNaissance: '2019-01-10', lieuNaissance: 'Lyon', sexe: Sexe.M, numeroDossier: 'EL-003', classeIdx: 3, parentIdx: 1 },
    // CE1 (classes[4])
    { nom: 'SIMON', prenom: 'Chloé', dateNaissance: '2018-05-18', lieuNaissance: 'Paris', sexe: Sexe.F, numeroDossier: 'EL-004', classeIdx: 4, parentIdx: 2 },
    { nom: 'FONTAINE', prenom: 'Maxime', dateNaissance: '2018-09-03', lieuNaissance: 'Marseille', sexe: Sexe.M, numeroDossier: 'EL-005', classeIdx: 4, parentIdx: 3 },
    // CE2 (classes[5])
    { nom: 'ROUSSEAU', prenom: 'Léa', dateNaissance: '2017-02-28', lieuNaissance: 'Paris', sexe: Sexe.F, numeroDossier: 'EL-006', classeIdx: 5, parentIdx: 4 },
    { nom: 'LAMBERT', prenom: 'Tom', dateNaissance: '2017-11-12', lieuNaissance: 'Bordeaux', sexe: Sexe.M, numeroDossier: 'EL-007', classeIdx: 5, parentIdx: 5 },
    // CM1 (classes[6])
    { nom: 'MOREAU', prenom: 'Jade', dateNaissance: '2016-06-30', lieuNaissance: 'Paris', sexe: Sexe.F, numeroDossier: 'EL-008', classeIdx: 6, parentIdx: 1 },
    // CM2 (classes[7])
    { nom: 'FONTAINE', prenom: 'Hugo', dateNaissance: '2015-04-05', lieuNaissance: 'Nice', sexe: Sexe.M, numeroDossier: 'EL-009', classeIdx: 7, parentIdx: 3 },
    { nom: 'LAMBERT', prenom: 'Inès', dateNaissance: '2015-08-19', lieuNaissance: 'Paris', sexe: Sexe.F, numeroDossier: 'EL-010', classeIdx: 7, parentIdx: 5 },
    // Maternelle PS (classes[0])
    { nom: 'PETIT', prenom: 'Zoé', dateNaissance: '2022-01-14', lieuNaissance: 'Paris', sexe: Sexe.F, numeroDossier: 'EL-011', classeIdx: 0, parentIdx: 0 },
    { nom: 'ROUSSEAU', prenom: 'Liam', dateNaissance: '2021-12-01', lieuNaissance: 'Paris', sexe: Sexe.M, numeroDossier: 'EL-012', classeIdx: 1, parentIdx: 4 },
  ];

  for (const e of elevesData) {
    const exists = await eleveRepo.findOne({ where: { numeroDossier: e.numeroDossier } });
    if (!exists) {
      await eleveRepo.save(eleveRepo.create({
        nom: e.nom,
        prenom: e.prenom,
        dateNaissance: new Date(e.dateNaissance),
        lieuNaissance: e.lieuNaissance,
        sexe: e.sexe,
        numeroDossier: e.numeroDossier,
        statut: StatutEleve.INSCRIT,
        classe: classes[e.classeIdx],
        parent: parents[e.parentIdx],
      }));
      console.log(`🎒 Élève créé : ${e.prenom} ${e.nom}`);
    }
  }

  await AppDataSource.destroy();
  console.log('\n✅ Seed terminé avec succès !');
  console.log('\n📋 Comptes créés :');
  console.log('  admin@ecole-primaire.fr       → Admin@2026!');
  console.log('  directeur@ecole-primaire.fr   → Directeur@2026!');
  console.log('  marie.dupont@ecole.fr         → Maitre@2026!');
  console.log('  paul.martin@ecole.fr          → Maitre@2026!');
  console.log('  sophie.bernard@ecole.fr       → Maitre@2026!');
  console.log('  jean.leroy@ecole.fr           → Maitre@2026!');
  console.log('  thomas.petit@gmail.com        → Parent@2026!');
  console.log('  (+ 5 autres parents)          → Parent@2026!');
}

seed().catch((err) => {
  console.error('❌ Erreur pendant le seed :', err);
  process.exit(1);
});
