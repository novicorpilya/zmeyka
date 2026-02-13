
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const lesson = await prisma.lesson.findUnique({
        where: { id: 'f6b4eb05-a625-468c-92bf-5fb25f662c6c' }
    })
    console.log(JSON.stringify(lesson, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
