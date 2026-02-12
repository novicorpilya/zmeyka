import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🧹 Cleaning database courses and related data...')

    try {
        // 1. Delete Payments (no cascade)
        const payments = await prisma.payment.deleteMany({})
        console.log(`- Deleted ${payments.count} payments`)

        // 2. Delete Homeworks and Comments
        const comments = await prisma.comment.deleteMany({})
        const homeworks = await prisma.homework.deleteMany({})
        console.log(`- Deleted ${comments.count} comments and ${homeworks.count} homeworks`)

        // 3. Delete Progress
        const progress = await prisma.userProgress.deleteMany({})
        console.log(`- Deleted ${progress.count} user progress records`)

        // 4. Delete Courses (Cascades to Modules, Lessons, Cohorts, Quizzes, Questions)
        const courses = await prisma.course.deleteMany({})
        console.log(`- Deleted ${courses.count} courses`)

        // 5. Delete Activities related to courses
        const activities = await prisma.userActivity.deleteMany({
            where: {
                type: {
                    in: ['LESSON_COMPLETED', 'HOMEWORK_SUBMITTED']
                }
            }
        })
        console.log(`- Deleted ${activities.count} activity records`)

        // 6. Delete Execution Logs
        const logs = await prisma.codeExecutionLog.deleteMany({})
        console.log(`- Deleted ${logs.count} code execution logs`)

        console.log('✅ Database cleaned successfully!')
    } catch (error) {
        console.error('❌ Error cleaning database:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
