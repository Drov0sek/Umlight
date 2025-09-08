import {PrismaClient} from "../../../generated/prisma/client";


const prisma = new PrismaClient()

async function isLoginValid(login : string){
    const studentLogins = await prisma.students.findMany({
        select : {
            login : true
        }
    }).then(r => r.map(e => e.login))
    const teacherLogins = await prisma.teachers.findMany({
        select : {
            login : true
        }
    }).then(r => r.map(e => e.login))
    return !(studentLogins.indexOf(login) === -1 && teacherLogins.indexOf(login) === -1);

}

export class GetUserService{
    async getUser(login : string){
        try {
            if (await isLoginValid(login)){
                const student = await prisma.students.findFirst({
                    where : {
                        login : login
                    }
                })
                if (student !== null){
                    return student
                }
                return await prisma.teachers.findFirst({
                    where: {
                        login: login
                    }
                })
            }
            else {
                console.log('Login is not valid')
                return 'Логин некорректен'
            }
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
}