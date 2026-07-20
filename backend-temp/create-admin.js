const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    const password = "admin123";
    const hash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: "admin@meuexame.com",
        password: hash,
        name: "Administrador",
        role: "ADMIN",
      },
    });
    console.log("? Admin criado com sucesso!");
    console.log("Email:", user.email);
    console.log("Senha:", password);
    console.log("ID:", user.id);
  } catch (e) {
    console.error("? Erro:", e.message);
    if (e.code === "P2002") {
      console.log("??  Este email j? est? em uso!");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
