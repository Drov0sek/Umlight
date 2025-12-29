import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})
export class GetTasksInfo{
    async getTasks(){
        const tasks = await prisma.public_tasks.findMany()
        return tasks
    }
    async getTaskById(id : number){
        const task = await prisma.public_tasks.findFirst({
            where : {
                id : id
            }
        })
        console.log(task)
        return task
    }
}