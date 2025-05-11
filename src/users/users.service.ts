import { Injectable } from '@nestjs/common';

// Mock user data
export type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      roles: ['user'],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      roles: ['admin', 'user'],
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      email: 'michael@example.com',
      roles: ['doctor', 'user'],
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      roles: ['patient', 'user'],
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'robert@example.com',
      roles: ['pharmacist', 'user'],
    },
    {
      id: 6,
      name: 'Dr. Emily Davis',
      email: 'emily@example.com',
      roles: ['doctor', 'admin', 'user'],
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }
}
