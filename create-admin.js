const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'admin@admin.com' },
      update: {},
      create: {
        id: 'admin',
        email: 'admin@admin.com',
        name: 'Admin User',
        password: hash,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Usuário admin criado com sucesso!');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Senha: admin123');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.();
  }
}
main();
