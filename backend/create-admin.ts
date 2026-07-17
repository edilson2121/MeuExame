import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating admin password...');
  
  const hashedPassword = await bcrypt.hash('admin123', 12);
  console.log('Hashed password:', hashedPassword);
  
  const admin = await prisma.user.update({
    where: { email: 'admin@meuexame.com' },
    data: { password: hashedPassword },
  });

  console.log('Admin password updated successfully for:', admin.email);
  console.log('Password hash in DB:', admin.password.substring(0, 20) + '...');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
