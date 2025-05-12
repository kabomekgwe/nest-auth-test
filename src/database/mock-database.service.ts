import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isActive: boolean;
}

@Injectable()
export class MockDatabaseService {
  private users: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      roles: ['user'],
      isActive: true,
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      roles: ['admin', 'user'],
      isActive: true,
    },
    {
      id: '3',
      email: 'michael@example.com',
      name: 'Dr. Michael Brown',
      roles: ['doctor', 'user'],
      isActive: true,
    },
    {
      id: '4',
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      roles: ['patient', 'user'],
      isActive: true,
    },
    {
      id: '5',
      email: 'robert@example.com',
      name: 'Robert Wilson',
      roles: ['pharmacist', 'user'],
      isActive: false, // Inactive user
    },
    {
      id: '6',
      email: 'emily@example.com',
      name: 'Dr. Emily Davis',
      roles: ['doctor', 'admin', 'user'],
      isActive: true,
    },
  ];

  async findUserById(id: string): Promise<User | undefined> {
    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.users.find(user => user.id === id);
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.users.find(user => user.email === email);
  }

  async isUserActive(id: string): Promise<boolean> {
    const user = await this.findUserById(id);
    return user ? user.isActive : false;
  }

  async getUserRoles(id: string): Promise<string[]> {
    const user = await this.findUserById(id);
    return user ? user.roles : [];
  }
}
