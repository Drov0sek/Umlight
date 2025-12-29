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
}