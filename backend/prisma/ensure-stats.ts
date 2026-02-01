import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function g() {
    const u = await p.user.findFirst()
    if (!u) return

    const a = await p.achievement.findFirst({ where: { title: 'Первая змейка в IT' } })
    if (a) {
        await p.userAchievement.upsert({
            where: { userId_achievementId: { userId: u.id, achievementId: a.id } },
            create: { userId: u.id, achievementId: a.id },
            update: {}
        })
        console.log('Assigned ach to user')
    }

    const s = await p.userStats.findUnique({ where: { userId: u.id } })
    if (!s) {
        await p.userStats.create({ data: { userId: u.id, xp: 50, streak: 1 } })
        console.log('Created stats for user')
    }
}

g().finally(() => p.$disconnect())
