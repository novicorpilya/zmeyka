import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function g() {
    // 1. Find or create teacher
    let teacher = await p.user.findFirst({ where: { role: 'TEACHER' } })
    if (!teacher) {
        const firstUser = await p.user.findFirst()
        if (firstUser) {
            teacher = await p.user.update({
                where: { id: firstUser.id },
                data: { role: 'TEACHER', name: 'Мастер Йода' }
            })
        }
    }

    if (!teacher) return

    // 2. Ensure teacher has a course
    let course = await p.course.findFirst({ where: { teacherId: teacher.id } })
    if (!course) {
        course = await p.course.create({
            data: {
                title: 'Python для Джедаев',
                description: 'Освой силу кода и управляй змейками.',
                teacherId: teacher.id
            }
        })
    }

    // 3. Create some pending homeworks from a student
    let student = await p.user.findFirst({ where: { role: 'STUDENT' } })
    if (!student) {
        student = await p.user.create({
            data: {
                email: 'padawan@zmeyka.io',
                password: 'hashed_password', // Mock
                name: 'Падаван',
                role: 'STUDENT'
            }
        })
    }

    const existingHw = await p.homework.findFirst({ where: { studentId: student.id, status: 'PENDING' } })
    if (!existingHw) {
        await p.homework.create({
            data: {
                studentId: student.id,
                courseId: course.id,
                status: 'PENDING'
            }
        })
        console.log('Created pending homework for teacher review')
    }

    console.log('Teacher test case prepared: ', teacher.email)
}

g().catch(console.error)
