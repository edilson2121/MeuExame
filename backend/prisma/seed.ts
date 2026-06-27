import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@meuexame.com' },
    update: {},
    create: {
      email: 'admin@meuexame.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@meuexame.com' },
    update: {},
    create: {
      email: 'user@meuexame.com',
      password: await bcrypt.hash('user123', 10),
      name: 'Usuário Teste',
      role: 'USER',
    },
  });

  console.log('✅ Seed completed!');
  console.log('👤 Admin: admin@meuexame.com / admin123');
  console.log('👤 User: user@meuexame.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });