import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAccountant() {
  try {
    console.log('Creating accountant user...');
    
    // Check if accountant already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'accountant@greenwood.edu' }
    });
    
    if (existing) {
      console.log('Accountant user already exists:', existing.email);
      await prisma.$disconnect();
      return;
    }
    
    // Get the school
    const school = await prisma.school.findFirst();
    if (!school) {
      console.error('No school found in database');
      await prisma.$disconnect();
      process.exit(1);
    }
    
    const password = await bcrypt.hash('accountant123', 10);
    
    const accountant = await prisma.user.create({
      data: {
        email: 'accountant@greenwood.edu',
        password,
        role: 'ACCOUNTANT',
        firstName: 'Robert',
        lastName: 'Johnson',
        phone: '+1-555-0200',
        schoolId: school.id,
      },
    });
    
    console.log('✅ Accountant user created successfully!');
    console.log('Email:', accountant.email);
    console.log('Password: accountant123');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error creating accountant:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAccountant();
