
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

// Load .env manually
const envPath = path.resolve(__dirname, '.env')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const parts = line.split('=')
        if (parts.length >= 2) {
            const key = parts[0].trim()
            const value = parts.slice(1).join('=').trim().replace(/"/g, '') // handle values with = inside
            process.env[key] = value
        }
    })
}

const prisma = new PrismaClient()

async function main() {
    console.log('--- Connecting to DB ---')
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) : 'undefined')

    try {
        const courses = await prisma.course.findMany({
            where: { title: { contains: 'www', mode: 'insensitive' } },
            include: { teacher: true }
        })
        console.log('Courses found:', courses.length)
        courses.forEach(c => {
            console.log(`Course: ${c.title}, Published: ${c.isPublished}, Teacher: ${c.teacher?.name} (${c.teacherId})`)
        })

        const user = await prisma.user.findFirst({
            where: { name: { contains: 'nosok', mode: 'insensitive' } }
        })
        if (user) {
            console.log(`User "nosok": ${user.name} (${user.id}), Role: ${user.role}`)

            // check match
            courses.forEach(c => {
                if (c.teacherId !== user.id) {
                    console.warn(`MISMATCH: Course teacherId ${c.teacherId} != User ID ${user.id}`)
                } else {
                    console.log('MATCH: Course belongs to this user.')
                }
            })

        } else {
            console.log('User "nosok" not found')
        }

    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
