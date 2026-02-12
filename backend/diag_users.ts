
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true }
    });
    console.log('--- USERS IN DATABASE ---');
    console.table(users);

    // Identify who should be what based on names (nosok usually teacher, Vanya usually student in this context)
    // Or just show them to the assistant
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
