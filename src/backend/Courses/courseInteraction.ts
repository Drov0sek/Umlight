import { PrismaClient } from '../../../generated/prisma/client';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/edge";
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
            if (e instanceof PrismaClientKnownRequestError){
                throw new PrismaClientKnownRequestError('Произошла ошибка', {code : 'P2025', clientVersion : '6.10.1'})
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
            if (e instanceof PrismaClientKnownRequestError){
                throw new PrismaClientKnownRequestError('Произошла ошибка', {code : 'P2025', clientVersion : '6.10.1'})
            }
            else {
                throw new Error()
            }
        }
    }
}