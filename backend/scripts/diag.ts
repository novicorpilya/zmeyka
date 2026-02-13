import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const users = await prisma.user.findMany({
            select: { email: true, role: true, id: true, name: true }
        });
        console.log('--- DATABASE USERS ---');
        console.log(JSON.stringify(users, null, 2));

        const courses = await prisma.course.findMany({
            select: { id: true, title: true, teacherId: true }
        });
        console.log('--- DATABASE COURSES ---');
        console.log(JSON.stringify(courses, null, 2));
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await prisma.$disconnect();
    }
}
main();
