import {PrismaClient} from "../../../generated/prisma/client";

const prisma = new PrismaClient()

type DataType = {
    name : string,
    surname : string,
    desc : string,
    nickname : string,
    age : number,
    subjects : string[]
}
type UserTaskType = {
    taskId : number,
    subject : string,
    isAnswerRight : boolean,
    type : string | null
}

export class GetUserInfo{
    async getStudentInfo(id : number){
        try{
            const student = await prisma.students.findFirst({
                where : {
                    id : id
                }
            })
            return student
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
    async getTeacherInfo(id : number){
        try{
            const teacher = await prisma.teachers.findFirst({
                where : {
                    id : id
                }
            })
            return teacher
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
    async getUserSubjects(id : number, role : string){
        if (role === 'teacher'){
            const teacherSubjectIds = await prisma.teachers_subjects.findMany({
                where : {
                    teacher_id : id
                }
            }).then(e => e.map(r => r.subject_id))
            const teacherSubjects = await prisma.subjects.findMany({
                where : {
                    id : {
                        in : teacherSubjectIds
                    }
                }
            }).then(e => e.map(r => r.subject))
            return teacherSubjects
        } else{
            const studentSubjectIds = await prisma.students_subjects.findMany({
                where : {
                    student_id : id
                }
            }).then(e => e.map(r => r.subject_id))
            const studentSubjects = await prisma.subjects.findMany({
                where : {
                    id : {
                        in : studentSubjectIds
                    }
                }
            }).then(e => e.map(r => r.subject))
            console.log(studentSubjects)
            return studentSubjects
        }
    }
    async changeUserInfo(role : string, id : number, data : DataType){
        if (role === 'teacher'){
            await prisma.teachers.update({
                where : {
                    id : id
                }, data : {
                    name : data.name,
                    surname : data.surname,
                    age : data.age,
                    description : data.desc
                }
            })
            const subjectIds = await prisma.subjects.findMany({
                where : {
                    subject : {
                        in : data.subjects
                    }
                }
            }).then(e => e.map(r => r.id))
            const hasSubjects = await prisma.teachers_subjects.findMany({
                where : {
                    teacher_id : id
                }
            }).then(e => e.length > 0)
            if (hasSubjects){
                await prisma.teachers_subjects.deleteMany({
                    where : {
                        teacher_id : id
                    }
                })
                for (let i = 0; i < subjectIds.length; i++){
                    await prisma.teachers_subjects.create({
                        data : {
                            teacher_id : id,
                            subject_id : subjectIds[i]
                        }
                    })
                }
            } else{
                for (let i = 0; i < subjectIds.length; i++){
                    await prisma.teachers_subjects.create({
                        data : {
                            teacher_id : id,
                            subject_id : subjectIds[i]
                        }
                    })
                }
            }
        } else {
            if (role === 'student'){
                await prisma.students.update({
                    where : {
                        id : id
                    }, data : {
                        name : data.name,
                        nickname : data.nickname,
                        surname : data.surname,
                        age : data.age,
                        description : data.desc
                    }
                })
                const subjectIds = await prisma.subjects.findMany({
                    where : {
                        subject : {
                            in : data.subjects
                        }
                    }
                }).then(e => e.map(r => r.id))
                const hasSubjects = await prisma.students_subjects.findMany({
                    where : {
                        student_id : id
                    }
                }).then(e => e.length > 0)
                if (hasSubjects){
                    await prisma.students_subjects.deleteMany({
                        where : {
                            student_id : id
                        }
                    })
                    for (let i = 0; i < subjectIds.length; i++){
                        await prisma.students_subjects.create({
                            data : {
                                student_id : id,
                                subject_id : subjectIds[i]
                            }
                        })
                    }
                } else{
                    for (let i = 0; i < subjectIds.length; i++){
                        await prisma.students_subjects.create({
                            data : {
                                student_id : id,
                                subject_id : subjectIds[i]
                            }
                        })
                    }
                }
            }

        }
    }
    async getUserCourses(id : number, role : string){
        if (role === 'teacher'){
            const courseIds = await prisma.courses.findMany({
                where : {
                    authorid : id
                }
            }).then(e => e.map(r => r.id))
            return courseIds
        }
        if (role === 'student'){
            const courseIds = await prisma.courses_students.findMany({
                where : {
                    studentid : id
                }
            }).then(e => e.map(r => r.courseid))
            return courseIds
        }
    }
    async setActiveTime(activeTime : number, userId : number, role : string, userTimeDate : string){
        await prisma.user_active_time.create({
            data : {
                user_id : userId,
                role : role,
                active_time : activeTime,
                active_time_day : userTimeDate
            }
        })
    }
    async getActiveTime(userId : number, role : string){
        const userTime = prisma.user_active_time.findMany({
            where : {
                user_id : userId,
                role : role
            }
        })
        return userTime
    }
    async setUserAnswerRight(userId : number, role : string, taskId : number, isAnswerRight : boolean){
        await prisma.user_answers_right.create({
            data : {
                user_id : userId,
                role : role,
                task_id : taskId,
                is_answer_right : isAnswerRight
            }
        })
    }
    async getUserTasksSubjects(userId : number, role : string){
        const userTaskIds = await prisma.user_answers_right.findMany({
            where : {
                user_id : userId,
                role : role
            }
        }).then(e => e.map(r => r.task_id))
        const subjectIds = await prisma.public_tasks.findMany({
            where : {
                id : {
                    in : userTaskIds
                }
            }
        }).then(e => e.map(r => r.subject_id))
        const subjects = await prisma.subjects.findMany({
            where : {
                id : {
                    in : subjectIds
                }
            }
        }).then(e => e.map(r => r.subject))
        return subjects
    }
    async getUserTasks(userId : number, role : string){
        const tasksArray = []
        const userTasks = await prisma.user_answers_right.findMany({
            where : {
                user_id : userId,
                role : role
            }
        })
        for (let i = 0; i < userTasks.length; i++){
            const taskSubjet = await prisma.public_tasks.findFirstOrThrow({
                where : {
                    id : userTasks[i].task_id
                }
            })
            const taskSubject = await prisma.subjects.findFirstOrThrow({
                where : {
                    id : taskSubjet.subject_id
                },
                select : {
                    subject : true
                }
            }).then(e => e.subject)
            const userTask : UserTaskType = {
                taskId : userTasks[i].task_id,
                subject : taskSubject,
                isAnswerRight : userTasks[i].is_answer_right,
                type : taskSubjet.type
            }
            tasksArray.push(userTask)
        }
        return tasksArray
    }
}