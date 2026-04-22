import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';
import { AnneeScolaireModule } from './annee-scolaire/annee-scolaire.module';
import { ClassesModule } from './classes/classes.module';
import { MatieresModule } from './matieres/matieres.module';
import { ParentsModule } from './parents/parents.module';
import { MaitresModule } from './maitres/maitres.module';
import { ElevesModule } from './eleves/eleves.module';
import { PresencesModule } from './presences/presences.module';
import { NotesModule } from './notes/notes.module';
import { BulletinsModule } from './bulletins/bulletins.module';
import { ExamensModule } from './examens/examens.module';
import { DevoirsModule } from './devoirs/devoirs.module';
import { FraisScolariteModule } from './frais-scolarite/frais-scolarite.module';
import { PaiementsModule } from './paiements/paiements.module';
import { DepensesModule } from './depenses/depenses.module';
import { CaisseModule } from './caisse/caisse.module';
import { MessagerieModule } from './messagerie/messagerie.module';
import { RapportsModule } from './rapports/rapports.module';

@Module({
  imports: [
    // Configuration globale (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Base de données PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    AuthModule,
    UsersModule,
    NotificationsModule,
    UploadModule,
    AnneeScolaireModule,
    ClassesModule,
    MatieresModule,
    ParentsModule,
    MaitresModule,
    ElevesModule,
    PresencesModule,
    NotesModule,
    BulletinsModule,
    ExamensModule,
    DevoirsModule,
    FraisScolariteModule,
    PaiementsModule,
    DepensesModule,
    CaisseModule,
    MessagerieModule,
    RapportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
