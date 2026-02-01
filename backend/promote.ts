import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findFirst()
    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'TEACHER' }
        })
        console.log(`User ${user.email} is now a TEACHER.`)
    } else {
        console.log('No users found.')
    }
}

main().catch(console.error).finally(() => prisma.$disconnect())
