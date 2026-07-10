import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@meuexame.com' },
    update: {},
    create: {
      email: 'admin@meuexame.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin criado:', admin.email);

  // Create institution
  const institution = await prisma.institution.upsert({
    where: { name: 'Universidade Eduardo Mondlane' },
    update: {},
    create: {
      name: 'Universidade Eduardo Mondlane',
      description: 'A principal universidade de Moçambique',
      city: 'Maputo',
      country: 'Moçambique',
      isPaid: true
    }
  });
  console.log('✅ Instituição criada:', institution.name);

  // Create subjects
  const subjects = [
    { name: 'Matemática', description: 'Fundamentos da matemática' },
    { name: 'Física', description: 'Física geral' },
    { name: 'Química', description: 'Química geral' }
  ];

  for (const data of subjects) {
    const subject = await prisma.subject.upsert({
      where: { name: data.name },
      update: {},
      create: {
        name: data.name,
        description: data.description,
        institutionId: institution.id
      }
    });
    console.log('✅ Disciplina criada:', subject.name);
  }

  console.log('🌱 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.();
  });
