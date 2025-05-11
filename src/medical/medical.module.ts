import { Module } from '@nestjs/common';
import { MedicalController } from './medical.controller';
import { MedicalService } from './medical.service';
import { AuthModule } from '../auth';

@Module({
  imports: [AuthModule],
  controllers: [MedicalController],
  providers: [MedicalService],
})
export class MedicalModule {}
