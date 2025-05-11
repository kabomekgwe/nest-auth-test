import { Controller, Get, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard, Roles, Public, Role } from '../auth';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Public endpoint - no authentication required
  @Public()
  @Get('public')
  getPublicData() {
    return { message: 'This is public data that anyone can access' };
  }

  // Protected endpoint - requires authentication but no specific role
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // Admin-only endpoint
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // Endpoint accessible to users with admin OR doctor role
  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR)
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Doctor-only endpoint
  @Get('medical/:id')
  @Roles(Role.DOCTOR)
  getMedicalData(@Param('id') id: string) {
    const user = this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      userId: user.id,
      name: user.name,
      medicalData: {
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        conditions: ['Hypertension'],
        lastCheckup: '2023-05-15',
      },
    };
  }

  // Pharmacist-only endpoint
  @Get('prescriptions/:id')
  @Roles(Role.PHARMACIST)
  getPrescriptions(@Param('id') id: string) {
    const user = this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      userId: user.id,
      name: user.name,
      prescriptions: [
        {
          id: 1,
          medication: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          prescribedBy: 'Dr. Michael Brown',
          date: '2023-06-01',
        },
        {
          id: 2,
          medication: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily at bedtime',
          prescribedBy: 'Dr. Emily Davis',
          date: '2023-06-15',
        },
      ],
    };
  }
}
