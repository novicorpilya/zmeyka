
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    await prisma.user.updateMany({
        data: { tokenVersion: { increment: 1 } }
    });
    console.log('All users token versions incremented. They will need to re-login.');
}
main().finally(() => prisma.$disconnect());
