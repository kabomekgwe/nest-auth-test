import { Injectable } from '@nestjs/common';

// Mock medical record data
export type MedicalRecord = {
  id: number;
  patientId: number;
  diagnosis: string;
  treatment: string;
  doctorId: number;
  date: string;
};

// Mock medication data
export type Medication = {
  id: number;
  name: string;
  description: string;
  sideEffects: string[];
  interactions: string[];
  requiresPrescription: boolean;
};

@Injectable()
export class MedicalService {
  private readonly medicalRecords: MedicalRecord[] = [
    {
      id: 1,
      patientId: 4,
      diagnosis: 'Hypertension',
      treatment: 'Prescribed Lisinopril 10mg daily',
      doctorId: 3,
      date: '2023-05-15',
    },
    {
      id: 2,
      patientId: 4,
      diagnosis: 'High Cholesterol',
      treatment: 'Prescribed Atorvastatin 20mg daily',
      doctorId: 6,
      date: '2023-06-15',
    },
    {
      id: 3,
      patientId: 1,
      diagnosis: 'Seasonal Allergies',
      treatment: 'Prescribed Cetirizine 10mg as needed',
      doctorId: 3,
      date: '2023-04-10',
    },
  ];

  private readonly medications: Medication[] = [
    {
      id: 1,
      name: 'Lisinopril',
      description: 'ACE inhibitor used to treat high blood pressure',
      sideEffects: ['Dry cough', 'Dizziness', 'Headache'],
      interactions: ['Potassium supplements', 'NSAIDs'],
      requiresPrescription: true,
    },
    {
      id: 2,
      name: 'Atorvastatin',
      description: 'Statin used to lower cholesterol levels',
      sideEffects: ['Muscle pain', 'Liver problems', 'Digestive issues'],
      interactions: ['Grapefruit juice', 'Certain antibiotics'],
      requiresPrescription: true,
    },
    {
      id: 3,
      name: 'Cetirizine',
      description: 'Antihistamine used to relieve allergy symptoms',
      sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
      interactions: ['Alcohol', 'CNS depressants'],
      requiresPrescription: false,
    },
  ];

  findAllRecords(): MedicalRecord[] {
    return this.medicalRecords;
  }

  findRecordsByPatient(patientId: number): MedicalRecord[] {
    return this.medicalRecords.filter(record => record.patientId === patientId);
  }

  findRecordsByDoctor(doctorId: number): MedicalRecord[] {
    return this.medicalRecords.filter(record => record.doctorId === doctorId);
  }

  findAllMedications(): Medication[] {
    return this.medications;
  }

  findMedicationById(id: number): Medication | undefined {
    return this.medications.find(med => med.id === id);
  }
}
