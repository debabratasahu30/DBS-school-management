const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'accountant@greenwood.edu' }
    });
    
    if (user) {
      console.log('✅ Accountant user exists:', user.email);
      console.log('Role:', user.role);
    } else {
      console.log('❌ Accountant user not found');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
  }
}

checkUser();
