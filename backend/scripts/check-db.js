
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const courses = await prisma.$queryRaw`SELECT id, title, price, "mentoringPrice" FROM "Course"`
    console.log(JSON.stringify(courses, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
