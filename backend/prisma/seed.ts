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

    // 2. Demo Course removed for testing clean state
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
