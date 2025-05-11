import { Controller, Get, Param, UseGuards, Request, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MedicalService } from './medical.service';
import { JwtAuthGuard, RolesGuard, Roles, Public, Role } from '../auth';

@Controller('medical')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalController {
  constructor(private medicalService: MedicalService) {}

  // Public endpoint with general medical information
  @Public()
  @Get('info')
  getPublicMedicalInfo() {
    return {
      message: 'This is public medical information',
      emergencyContact: '911',
      generalHealthTips: [
        'Stay hydrated',
        'Exercise regularly',
        'Get enough sleep',
        'Eat a balanced diet',
      ],
    };
  }

  // Endpoint for medication information - accessible to doctors, pharmacists, and patients
  @Get('medications')
  @Roles(Role.DOCTOR, Role.PHARMACIST, Role.PATIENT)
  getAllMedications() {
    return this.medicalService.findAllMedications();
  }

  // Detailed medication information - accessible to doctors and pharmacists only
  @Get('medications/:id/details')
  @Roles(Role.DOCTOR, Role.PHARMACIST)
  getMedicationDetails(@Param('id') id: string) {
    const medication = this.medicalService.findMedicationById(+id);
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return medication;
  }

  // Patient records - accessible to doctors and the patient themselves
  @Get('records/patient/:patientId')
  async getPatientRecords(@Param('patientId') patientId: string, @Request() req) {
    const patientIdNum = +patientId;
    
    // Check if the user is a doctor or the patient themselves
    const isDoctor = req.user.roles && req.user.roles.includes(Role.DOCTOR);
    const isPatient = req.user.sub === patientIdNum || req.user.id === patientIdNum;
    
    if (!isDoctor && !isPatient) {
      throw new ForbiddenException('You do not have permission to access these records');
    }
    
    const records = this.medicalService.findRecordsByPatient(patientIdNum);
    if (!records.length) {
      throw new NotFoundException(`No medical records found for patient with ID ${patientId}`);
    }
    
    return records;
  }

  // Doctor's records - accessible to the doctor only
  @Get('records/doctor/:doctorId')
  @Roles(Role.DOCTOR)
  getDoctorRecords(@Param('doctorId') doctorId: string, @Request() req) {
    const doctorIdNum = +doctorId;
    
    // Check if the user is the doctor themselves
    const isDoctorSelf = req.user.sub === doctorIdNum || req.user.id === doctorIdNum;
    
    if (!isDoctorSelf && !req.user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException('You can only access your own records');
    }
    
    const records = this.medicalService.findRecordsByDoctor(doctorIdNum);
    if (!records.length) {
      throw new NotFoundException(`No medical records found for doctor with ID ${doctorId}`);
    }
    
    return records;
  }

  // Admin access to all records
  @Get('records/all')
  @Roles(Role.ADMIN)
  getAllRecords() {
    return this.medicalService.findAllRecords();
  }
}
