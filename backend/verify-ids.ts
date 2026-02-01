import { PrismaClient } from '@prisma/client';

async function verify() {
    const prisma = new PrismaClient();
    const lessonId = '8ab01b21-c791-4ff0-bf78-ad90d6a78f98';

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { module: { include: { course: true } } }
    });

    if (lesson) {
        console.log('Lesson found:', lesson.title);
        console.log('Course ID:', lesson.module.courseId);
    } else {
        console.log('Lesson NOT found');
    }

    const users = await prisma.user.findMany({ take: 5 });
    console.log('Sample Users:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));

    await prisma.$disconnect();
}

verify();
