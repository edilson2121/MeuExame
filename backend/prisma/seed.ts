import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================
  // PLANS
  // ============================================
  console.log('Creating plans...');

  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { id: 'plan-daily' },
      update: {},
      create: {
        id: 'plan-daily',
        name: 'Diário',
        description: 'Acesso por 1 dia',
        price: 50,
        duration: 1,
        type: 'DAILY',
        isActive: true,
      },
    }),
    prisma.plan.upsert({
      where: { id: 'plan-weekly' },
      update: {},
      create: {
        id: 'plan-weekly',
        name: 'Semanal',
        description: 'Acesso por 7 dias',
        price: 250,
        duration: 7,
        type: 'WEEKLY',
        isActive: true,
      },
    }),
    prisma.plan.upsert({
      where: { id: 'plan-monthly' },
      update: {},
      create: {
        id: 'plan-monthly',
        name: 'Mensal',
        description: 'Acesso por 30 dias',
        price: 750,
        duration: 30,
        type: 'MONTHLY',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${plans.length} plans`);

  // ============================================
  // ADMIN USER
  // ============================================
  console.log('Creating admin user...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@meuexame.com' },
    update: {},
    create: {
      email: 'admin@meuexame.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Created admin: ${admin.email}`);

  // ============================================
  // TEACHER USER
  // ============================================
  const teacher = await prisma.user.upsert({
    where: { email: 'professor@meuexame.com' },
    update: {},
    create: {
      email: 'professor@meuexame.com',
      password: hashedPassword,
      name: 'Professor João',
      role: 'TEACHER',
    },
  });

  console.log(`✅ Created teacher: ${teacher.email}`);

  // ============================================
  // TEST USER
  // ============================================
  const testUser = await prisma.user.upsert({
    where: { email: 'estudante@meuexame.com' },
    update: {},
    create: {
      email: 'estudante@meuexame.com',
      password: hashedPassword,
      name: 'Estudante Teste',
      role: 'USER',
    },
  });

  console.log(`✅ Created test user: ${testUser.email}`);

  // ============================================
  // INSTITUTIONS
  // ============================================
  console.log('Creating institutions...');

  const institutions = await Promise.all([
    prisma.institution.upsert({
      where: { id: 'inst-uem' },
      update: {},
      create: {
        id: 'inst-uem',
        name: 'Universidade Eduardo Mondlane',
        city: 'Maputo',
        country: 'Moçambique',
        isActive: true,
        isPaid: true,
      },
    }),
    prisma.institution.upsert({
      where: { id: 'inst-ucm' },
      update: {},
      create: {
        id: 'inst-ucm',
        name: 'Universidade Católica de Moçambique',
        city: 'Beira',
        country: 'Moçambique',
        isActive: true,
        isPaid: true,
      },
    }),
    prisma.institution.upsert({
      where: { id: 'inst-ust' },
      update: {},
      create: {
        id: 'inst-ust',
        name: 'Universidade Save the Children',
        city: 'Tete',
        country: 'Moçambique',
        isActive: true,
        isPaid: false,
      },
    }),
  ]);

  console.log(`✅ Created ${institutions.length} institutions`);

  // ============================================
  // COURSES
  // ============================================
  console.log('Creating courses...');

  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: 'course-engenharias' },
      update: {},
      create: {
        id: 'course-engenharias',
        name: 'Engenharias',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-saude' },
      update: {},
      create: {
        id: 'course-saude',
        name: 'Ciências da Saúde',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-economia' },
      update: {},
      create: {
        id: 'course-economia',
        name: 'Economia e Gestão',
      },
    }),
  ]);

  console.log(`✅ Created ${courses.length} courses`);

  // ============================================
  // SUBJECTS
  // ============================================
  console.log('Creating subjects...');

  await prisma.subject.createMany({
    data: [
      { id: 'sub-matematica', name: 'Matemática', courseId: 'course-engenharias', institutionId: 'inst-uem' },
      { id: 'sub-fisica', name: 'Física', courseId: 'course-engenharias', institutionId: 'inst-uem' },
      { id: 'sub-quimica', name: 'Química', courseId: 'course-saude', institutionId: 'inst-uem' },
      { id: 'sub-portugues', name: 'Português', courseId: 'course-economia', institutionId: 'inst-ucm' },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created subjects`);

  // ============================================
  // SAMPLE EXAM
  // ============================================
  console.log('Creating sample exam...');

  const exam = await prisma.exam.upsert({
    where: { id: 'exam-matematica-2024' },
    update: {},
    create: {
      id: 'exam-matematica-2024',
      title: 'Exame de Admissão - Matemática 2024',
      description: 'Exame de matemática para admissão à UEM',
      subjectId: 'sub-matematica',
      authorId: teacher.id,
      duration: 120,
      totalPoints: 20,
      status: 'PUBLISHED',
      year: 2024,
    },
  });

  console.log(`✅ Created exam: ${exam.title}`);

  // ============================================
  // SAMPLE QUESTIONS
  // ============================================
  console.log('Creating sample questions...');

  const questions = [
    { id: 'q1', text: 'Quanto é 2 + 2?', type: 'MULTIPLE_CHOICE' as const, options: JSON.stringify(['3', '4', '5', '6']), correctAnswer: '4', points: 2 },
    { id: 'q2', text: 'Quanto é 10 × 5?', type: 'MULTIPLE_CHOICE' as const, options: JSON.stringify(['45', '50', '55', '60']), correctAnswer: '50', points: 2 },
    { id: 'q3', text: 'Quanto é 100 ÷ 4?', type: 'MULTIPLE_CHOICE' as const, options: JSON.stringify(['20', '25', '30', '35']), correctAnswer: '25', points: 2 },
  ];

  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: q,
    });

    await prisma.examQuestion.upsert({
      where: { examId_questionId: { examId: exam.id, questionId: q.id } },
      update: {},
      create: { examId: exam.id, questionId: q.id, points: q.points },
    });
  }

  console.log(`✅ Created ${questions.length} questions`);

  // ============================================
  // SAMPLE CONTENT
  // ============================================
  console.log('Creating sample content...');

  await prisma.content.upsert({
    where: { id: 'content-intro-mat' },
    update: {},
    create: {
      id: 'content-intro-mat',
      title: 'Introdução à Matemática',
      description: 'Conceitos básicos de matemática',
      content: '<h1>Introdução</h1><p>Matemática é a ciência dos números...</p>',
      type: 'TEXT',
      subjectId: 'sub-matematica',
      authorId: teacher.id,
      views: 150,
      likes: 25,
    },
  });

  console.log('✅ Created sample content');

  // ============================================
  // PAGES
  // ============================================
  console.log('Creating pages...');

  await prisma.page.upsert({
    where: { slug: 'sobre-nos' },
    update: {},
    create: {
      title: 'Sobre Nós',
      slug: 'sobre-nos',
      content: '<h1>Sobre o MeuExame</h1><p>Somos uma plataforma educacional...</p>',
      description: 'Conheça nossa história',
      status: 'PUBLISHED',
      showInMenu: true,
      menuOrder: 1,
      authorId: admin.id,
    },
  });

  await prisma.page.upsert({
    where: { slug: 'contactos' },
    update: {},
    create: {
      title: 'Contactos',
      slug: 'contactos',
      content: '<h1>Contacte-nos</h1><p>Email: info@meuexame.com</p>',
      description: 'Fale conosco',
      status: 'PUBLISHED',
      showInMenu: true,
      menuOrder: 2,
      authorId: admin.id,
    },
  });

  console.log('✅ Created pages');

  console.log('');
  console.log('==========================================');
  console.log('✅ SEED COMPLETED SUCCESSFULLY!');
  console.log('==========================================');
  console.log('');
  console.log('📧 Admin: admin@meuexame.com / admin123');
  console.log('📧 Professor: professor@meuexame.com / admin123');
  console.log('📧 Estudante: estudante@meuexame.com / admin123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
