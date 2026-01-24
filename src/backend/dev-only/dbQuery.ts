import { PrismaClient } from '../../../generated/prisma/client'
import {hashSync} from "bcrypt";

const prisma = new PrismaClient()

async function main() {
    const teacherLogins = await prisma.courses_students.findMany({
    })
    console.log(hashSync('Qwerty123!', 12))
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