const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    // Delete existing user if exists
    await prisma.user.deleteMany({
      where: { email: 'demo@blajarplus.com' }
    });

    // Hash password
    const passwordHash = await bcrypt.hash('demo12345', 10);
    
    console.log('Creating user with hash:', passwordHash);
    
    // Verify hash works
    const isValid = await bcrypt.compare('demo12345', passwordHash);
    console.log('Hash verification:', isValid);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: 'demo@blajarplus.com',
        phone: '+6281234567890',
        passwordHash: passwordHash,
        fullName: 'Demo User BlajarPlus',
        gender: 'male',
        address: 'Jl. Sudirman No. 123, Kebayoran Baru',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        bio: 'Saya adalah user demo untuk testing. Suka belajar matematika dan bahasa Inggris!',
        role: 'student',
        status: 'active',
      },
    });

    console.log('User created successfully!');
    console.log('Email:', user.email);
    console.log('Name:', user.fullName);
    console.log('Role:', user.role);
    console.log('\nLogin credentials:');
    console.log('Email: demo@blajarplus.com');
    console.log('Password: demo12345');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser();
