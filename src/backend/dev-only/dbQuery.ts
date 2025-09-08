import { PrismaClient } from '../../../generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
    const teacherLogins = await prisma.courses_students.findMany({
    })
    console.log(teacherLogins)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })