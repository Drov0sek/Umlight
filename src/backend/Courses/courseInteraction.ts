import { PrismaClient } from '../../../generated/prisma/client';
import {HasAlreadyJoinedError} from "../errors/HasAlreadyJoinedError.js";

const prisma = new PrismaClient();

type JoinCourseType = {
    userLogin : string,
    courseId : number
}
type IsInCourseType = {
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
            else {
                if (hasJoined) {
                    throw new HasAlreadyJoinedError('Вы уже вступили в этот курс')
                }
            }
        } catch (e) {
            console.log(e)
            if (e instanceof HasAlreadyJoinedError){
                throw new HasAlreadyJoinedError('Вы уже вступили в этот курс')
            }
            else {
                throw new Error()
            }
        }
    }
    async isInCourse(data : IsInCourseType){
        try{
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
            return hasJoined
        }
        catch (e) {
            console.log(e)
            throw new Error()
        }
    }
}