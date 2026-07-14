"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed...');
    const existingCourses = await prisma.course.count();
    if (existingCourses > 0) {
        console.log('Courses already exist. Skipping seed.');
        return;
    }
    const coursesData = [
        { name: 'Engenharia de Software' },
        { name: 'Ciencia da Computacao' },
        { name: 'Engenharia Civil' },
        { name: 'Administracao' },
        { name: 'Medicina' },
    ];
    console.log('Creating courses...');
    for (const data of coursesData) {
        const course = await prisma.course.create({ data });
        console.log('Created course: ' + course.name);
    }
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(() => {
    prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map