
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Fix nosok -> TEACHER (or keep ADMIN but add privilege logic)
    // Fix Vanya -> STUDENT

    await prisma.user.update({
        where: { email: 'nosok@gmail.com' },
        data: { role: 'TEACHER' }
    });

    await prisma.user.update({
        where: { email: 'vanya222@gmail.com' },
        data: { role: 'STUDENT' }
    });

    console.log('Roles successfully swapped/fixed!');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
