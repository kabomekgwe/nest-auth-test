import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { UsersModule } from './users/users.module';
import { MedicalModule } from './medical/medical.module';
import { DatabaseModule } from './database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    MedicalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
