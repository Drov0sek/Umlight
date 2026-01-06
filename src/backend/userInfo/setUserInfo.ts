import {PrismaClient} from "../../../generated/prisma/client";

const prisma = new PrismaClient()

export class SetUserInfo{
    async setSeenLesson(userId : number, seenLessonId : number){
        const seenLessons = await prisma.seen_lessons.findMany().then(e => e.map(r => r.lesson_id))
         if (!seenLessons.includes(seenLessonId)){
             await prisma.seen_lessons.create({
                 data : {
                     user_id : userId,
                     role : 'student',
                     lesson_id : seenLessonId
                 }
             })
         }
    }
    async setDonePracticeLesson(userId : number, practiceLessonId : number){
        const donePracticeLessons = await prisma.done_practice_lessons.findMany().then(e => e.map(r => r.practice_lesson_id))
        if (!donePracticeLessons.includes(practiceLessonId)){
            await prisma.done_practice_lessons.create({
                data : {
                    user_id : userId,
                    role : 'student',
                    practice_lesson_id : practiceLessonId
                }
            })
        }
    }
    async setDonePracticeLessonTasks(userId : number, lessonTaskId : number, answer : string, isAnswerRight : boolean){
        await prisma.done_lesson_tasks.create({
            data : {
                user_id : userId,
                role : 'student',
                lesson_task_id : lessonTaskId,
                answer : answer,
                is_answer_right : isAnswerRight
            }
        })
    }
}