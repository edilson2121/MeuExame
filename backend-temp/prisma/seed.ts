import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar um usuário admin
  await prisma.user.create({
    data: {
      email: 'admin@meuexame.com',
      password: '$2a$10$...', // Use bcrypt para gerar
      name: 'Admin',
      role: 'ADMIN', // Alterado de SUPER_ADMIN para ADMIN
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
