import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@meuexame.com';
  const password = 'admin123';
  
  console.log('Creating/updating admin user...');
  
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const admin = await prisma.user.upsert({
    where: { email },
    update: { 
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Administrador'
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Administrador'
    },
  });

  console.log('✅ Admin user ready!');
  console.log('Email:', admin.email);
  console.log('Role:', admin.role);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
