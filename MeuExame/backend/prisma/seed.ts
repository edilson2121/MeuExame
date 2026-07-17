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
    const existingSubject = await prisma.subject.findFirst({
      where: { 
        name: data.name,
        institutionId: institution.id 
      }
    });

    if (!existingSubject) {
      const subject = await prisma.subject.create({
        data: {
          name: data.name,
          description: data.description,
          institutionId: institution.id
        }
      });
      console.log('✅ Disciplina criada:', subject.name);
    } else {
      console.log('ℹ️ Disciplina já existe:', data.name);
    }
  }

  console.log('🌱 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
