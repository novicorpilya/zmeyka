
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const homeworks = await prisma.homework.findMany({
        include: {
            student: true,
            comments: {
                include: { author: true }
            }
        }
    });
    console.log(JSON.stringify(homeworks, null, 2));
}
main().finally(() => prisma.$disconnect());
