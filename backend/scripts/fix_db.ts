import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const teacherEmail = 'nosok@gmail.com';
    const courseId = '6f2a1dea-ea4f-4eb2-b202-ce6fde4c1d3f';

    const teacher = await prisma.user.update({
        where: { email: teacherEmail },
        data: { role: 'ADMIN' } // Прокачиваем до Админа для гарантии
    });
    console.log('User nosok promoted to ADMIN');

    await prisma.course.update({
        where: { id: courseId },
        data: { teacherId: teacher.id }
    });
    console.log('Course WWWWWW transferred to nosok');

    // На всякий случай сделаем и Ваню учителем, если это твой второй акк
    await prisma.user.update({
        where: { email: 'vanya222@gmail.com' },
        data: { role: 'TEACHER' }
    }).catch(() => { });
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
