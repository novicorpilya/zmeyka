
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkLatestHomework() {
    try {
        const homework = await prisma.homework.findFirst({
            orderBy: { createdAt: 'desc' },
            include: {
                student: true,
                lesson: true
            }
        })

        if (!homework) {
            console.log('No homeworks found.')
            return
        }

        console.log('--- Latest Homework ---')
        console.log('ID:', homework.id)
        console.log('Student:', homework.student?.name)
        console.log('Lesson:', homework.lesson?.title)
        console.log('Status:', homework.status)
        console.log('Created At:', homework.createdAt)
        console.log('Feedback:', homework.feedback)
        console.log('AI Reasoning:', (homework as any).aiReasoning)

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}
checkLatestHomework()
