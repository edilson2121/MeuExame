const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Directly specify the database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@postgres:5432/meuexame?schema=public'
    }
  }
});

async function main() {
  try {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    // Check if admin exists
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' }
    });
    
    if (existing) {
      console.log('✅ Admin user already exists:', existing.id);
      console.log('Email:', existing.email);
      return;
    }
    
    // Create admin user
    const user = await prisma.user.create({
      data: {
        id: 'admin',
        email: 'admin@admin.com',
        name: 'Admin User',
        password: hash,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Password: admin123');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();