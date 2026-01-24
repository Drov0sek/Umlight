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
type UserLessonTaskDataType = {
    tasksAmount : number,
    rightAnswersPercentage : number,
    lessonName : string
}
type TeacherStudentStatsDataType = {
    avgSeenLessonsPerc : number,
    avgDonePracticeLessonsPerc : number,
    avgSeenModulesPerc : number,
    studentsTaskData : UserLessonTaskDataType[][],
    studentsAmount : number
}
async function getCourseLessons(courseId : number, needTypes : boolean, type : string){
    const moduleIds = await prisma.courses_modules.findMany({
        where : {
            courseid : courseId
        }
    }).then(e => e.map(r => r.moduleid))
    if (needTypes){
        const courseLessonIds = await prisma.modules_lessons.findMany({
            where : {
                moduleid : {
                    in : moduleIds
                }
            }
        }).then(e => e.map(r => r.lessonid))
        const courseLessonsWithTypesIds = await prisma.lesson.findMany({
            where : {
                id : {
                    in : courseLessonIds
                },
                type : type
            }
        }).then(e => e.map(r => r.id))
        return courseLessonsWithTypesIds
    } else {
        const courseLessonIds = await prisma.modules_lessons.findMany({
            where : {
                moduleid : {
                    in : moduleIds
                }
            }
        }).then(e => e.map(r => r.lessonid))
        return courseLessonIds
    }
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
    async getUserCourseIds(id : number, role : string){
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
    async getStudentCoursesData(userId : number){
        const courseIds = await prisma.courses_students.findMany({
            where : {
                studentid : userId
            }
        }).then(e => e.map(r => r.courseid))
        const courses = await prisma.courses.findMany({
            where : {
                id : {
                    in : courseIds
                }
            }
        })
        return courses
    }
    async getStudentDonePracticeLessonsPercentages(userId : number, courseId : number){
        const allPracticeLessonsIds = await getCourseLessons(courseId, true, 'Практика')
        const donePracticeLessonIds = await prisma.done_practice_lessons.findMany({
            where : {
                user_id : userId,
                practice_lesson_id : {
                    in : allPracticeLessonsIds
                }
            }
        }).then(e => e.map(r => r.practice_lesson_id))
        const allPracticeLessons = await prisma.lesson.findMany({
            where : {
                type : 'Практика',
                id : {
                    in : allPracticeLessonsIds
                }
            }
        })
        if (allPracticeLessons.length !== 0){
            return Math.round(donePracticeLessonIds.length / allPracticeLessons.length * 100)
        }
        else{
            return 0
        }
    }
    async getSeenLessonsAmount(userId : number, courseId : number){
        const allLessonsIds = await getCourseLessons(courseId, false, '')
        const seenLessonsAmount = await prisma.seen_lessons.findMany({
            where : {
                user_id : userId,
                lesson_id : {
                    in : allLessonsIds
                }
            }
        }).then(e => e.length)
        const donePracticeLessonAmount = await prisma.done_practice_lessons.findMany({
            where : {
                user_id : userId,
                practice_lesson_id : {
                    in : allLessonsIds
                }
            }
        }).then(e => e.length)
        return Math.round((seenLessonsAmount + donePracticeLessonAmount) / allLessonsIds.length * 100)
    }
    async getSeenModulesPercentage(userId : number, courseId : number){
        const allLessonsIds = await getCourseLessons(courseId, false, '')
        const seenLessonsId = await prisma.seen_lessons.findMany({
            where : {
                user_id : userId,
                lesson_id : {
                    in : allLessonsIds
                }
            }
        }).then(e => e.map(r => r.lesson_id))
        const donePracticeLessonIds = await prisma.done_practice_lessons.findMany({
            where : {
                user_id : userId,
                practice_lesson_id : {
                    in : allLessonsIds
                }
            }
        }).then(e => e.map(r => r.practice_lesson_id))
        const courseModules = await prisma.courses_modules.findMany({
            where : {
                courseid : courseId
            }
        }).then(e => e.map(r => r.moduleid))
        let seenModules = 0
        for (let i = 0; i < courseModules.length;i++){
            const moduleLessons = await prisma.modules_lessons.findMany({
                where : {
                    moduleid : courseModules[i]
                }
            }).then(e => e.map(r => r.lessonid))
            if (moduleLessons.every(el => seenLessonsId.includes(el) || donePracticeLessonIds.includes(el))){
                seenModules = seenModules + 1
            }
        }
        return Math.round(seenModules / courseModules.length * 100)
    }
    async getDonePracticeTasksAnswerRightData(userId : number, courseId : number){
        const allCourseLessons = await getCourseLessons(courseId, true, 'Практика')
        const userTaskDataArr = []
        for (let i = 0; i < allCourseLessons.length;i++){
            const lessonName = await prisma.lesson.findFirstOrThrow({
                where : {
                    id : allCourseLessons[i]
                }
            }).then(e => e.name)
            const lessonTaskIds = await prisma.lesson_tasks.findMany({
                where : {
                    lesson_id : allCourseLessons[i]
                }
            }).then(e => e.map(r => r.id))
            const rightLessonTasksPercentage = await prisma.done_lesson_tasks.findMany({
                where : {
                    lesson_task_id : {
                        in : lessonTaskIds
                    },
                    user_id : userId
                }
            }).then(e => Math.round(e.map(r => r.is_answer_right).filter(r => r).length / e.map(r => r.is_answer_right).length * 100))
            const userTaskData : UserLessonTaskDataType = {
                tasksAmount : lessonTaskIds.length,
                rightAnswersPercentage : rightLessonTasksPercentage,
                lessonName : lessonName
            }
            userTaskDataArr.push(userTaskData)
        }
        console.log(userTaskDataArr)
        return userTaskDataArr
    }
    async getTeacherStudentsAverageStats(courseId : number){
        const teacherStudentIds = await prisma.courses_students.findMany({
            where : {
                courseid : courseId
            }
        }).then(e => e.map(r => r.studentid))
        console.log('students', teacherStudentIds)
        let sumSeenLessonsPerc = 0
        let sumSeenModulesPerc = 0
        let sumDonePracticeLessonsPerc = 0
        const studentsTaskData = []
        for (let i = 0; i < teacherStudentIds.length; i++){
            sumSeenLessonsPerc = sumSeenLessonsPerc + await this.getSeenLessonsAmount(teacherStudentIds[i], courseId)
            sumSeenModulesPerc = sumSeenModulesPerc + await this.getSeenModulesPercentage(teacherStudentIds[i], courseId)
            sumDonePracticeLessonsPerc = sumDonePracticeLessonsPerc + await this.getStudentDonePracticeLessonsPercentages(teacherStudentIds[i], courseId)
            const userTaskData = await this.getDonePracticeTasksAnswerRightData(teacherStudentIds[i], courseId).then(e => e)
            studentsTaskData.push(userTaskData)
        }
        const data : TeacherStudentStatsDataType = {
            avgSeenLessonsPerc : Math.round(sumSeenLessonsPerc / teacherStudentIds.length),
            avgDonePracticeLessonsPerc : Math.round(sumDonePracticeLessonsPerc / teacherStudentIds.length),
            avgSeenModulesPerc : Math.round(sumSeenModulesPerc / teacherStudentIds.length),
            studentsTaskData : studentsTaskData,
            studentsAmount : teacherStudentIds.length
        }
        console.log('data', JSON.stringify(data))
        return data
    }
    async getTeacherCourses(teacherId : number){
        const courses = await prisma.courses.findMany({
            where : {
                authorid : teacherId
            },
            select : {
                id : true,
                name : true
            }
        })
        return courses
    }
    async getAllTeachers(){
        const teachers = await prisma.teachers.findMany()
        return teachers
    }
}