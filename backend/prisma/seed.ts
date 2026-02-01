import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding startup data...')

    // 1. Demo Teacher
    const teacherEmail = 'master@zmeyka.io'
    const adminEmail = 'admin@zmeyka.io'

    const hashedPassword = await bcrypt.hash('password123', 12)

    let teacher = await prisma.user.findUnique({ where: { email: teacherEmail } })
    if (!teacher) {
        teacher = await prisma.user.create({
            data: {
                email: teacherEmail,
                password: hashedPassword,
                name: 'Мастер Питон',
                role: 'TEACHER'
            }
        })
    }

    let admin = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (!admin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Администратор',
                role: 'ADMIN'
            }
        })
    }

    // 2. Demo Course
    const existingCourse = await prisma.course.findFirst({ where: { title: 'Python для Начинающих Змеек' } })
    if (!existingCourse) {
        await prisma.course.create({
            data: {
                title: 'Python для Начинающих Змеек',
                description: 'Основы программирования с нуля до первой игры',
                thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
                teacherId: teacher.id,
                modules: {
                    create: [
                        {
                            title: 'Знакомство с гнездом',
                            order: 1,
                            lessons: {
                                create: [
                                    { title: 'Привет, Мир!', order: 1, content: 'Печать текста...' },
                                    { title: 'Переменные и Числа', order: 2, content: 'Как хранить данные...' },
                                ]
                            }
                        }
                    ]
                }
            }
        })
    }

    console.log(`✅ Seed finished!`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
