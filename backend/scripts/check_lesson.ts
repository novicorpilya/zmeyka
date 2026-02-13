
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
    const lesson = await prisma.lesson.findUnique({
        where: { id: 'f6b4eb05-a625-468c-92bf-5fb25f662c6c' }
    })
    console.log('--- Lesson data ---')
    console.log('ID:', lesson?.id)
    console.log('Title:', lesson?.title)
    console.log('ContentRich length:', lesson?.contentRich?.length || 0)
    console.log('ContentRich exists:', !!lesson?.contentRich)
    await prisma.$disconnect()
}

check().catch(console.error)
