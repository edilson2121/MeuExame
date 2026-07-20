const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.deleteMany({ where: { email: 'admin@admin.com' } });
    console.log('✅ Usuário antigo removido');
    
    const hash = await bcrypt.hash('admin123', 10);
    console.log('🔐 Hash gerado:', hash);
    
    const user = await prisma.user.create({
      data: {
        id: 'admin_' + Date.now(),
        email: 'admin@admin.com',
        name: 'Administrador',
        password: hash,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin criado com sucesso!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Senha: admin123');
    console.log('🔐 Hash no banco:', user.password);
  } catch(e) {
    console.error('❌ Erro:', e.message);
  } finally {
    await prisma.();
  }
}
main();
