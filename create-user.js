const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    const password = "123456";
    const hash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: "maria@teste.com",
        password: hash,
        name: "Maria",
        role: "USER",
      },
    });
    console.log("? Usu?rio criado com sucesso!");
    console.log("Email:", user.email);
    console.log("Senha:", password);
    console.log("ID:", user.id);
  } catch (e) {
    console.error("? Erro:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
