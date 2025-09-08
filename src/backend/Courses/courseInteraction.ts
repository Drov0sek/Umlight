import { PrismaClient } from '../../../generated/prisma/client';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/edge";

const prisma = new PrismaClient();

type JoinCourseType = {
    userLogin : string,
    courseId : number
}

export class CourseInteraction{
    async joinCourse(data : JoinCourseType){
        try {
            const userId = await prisma.students.findFirstOrThrow({
                where : {
                    login : data.userLogin
                },
                select : {
                    id : true
                }
            }).then(e => e.id)
            const hasJoined = await prisma.courses_students.findFirst({
                where : {
                    courseid : data.courseId,
                    studentid : userId
                }
            })
            if (userId && !hasJoined){
                await prisma.courses_students.create({
                    data : {
                        courseid : data.courseId,
                        studentid : userId
                    }
                })
            }
            console.log(userId,hasJoined,'hjgk')
        } catch (e) {
            console.log(e)
            if (e instanceof PrismaClientKnownRequestError){
                throw new PrismaClientKnownRequestError('',{code : 'P2025', meta :{ modelName: 'students', cause: 'No record was found for a query.' },clientVersion : '6.10.1'})
            } else {
                throw new Error()
            }
        }
    }
}