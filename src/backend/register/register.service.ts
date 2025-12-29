import { PrismaClient } from '../../../generated/prisma/client';
import {hashSync} from "bcrypt";
import {NotUniqueLoginError} from "../errors/NotUniqueLoginError.js";

type Student = {
    name : string,
    login : string,
    password : string,
    surname : string,
    gender : string,
    nickname : string,
    email : string,
    age : number
}
type Teacher = {
    name : string,
    surname : string,
    email : string,
    login : string,
    password : string,
    gender : string
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

export class RegisterService {
    async createStudent(student : Student){
        const studentLogins = await prisma.students.findMany({
            select : {
                login : true
            }
        })
        const studentLoginsText = studentLogins.map(r => r.login)
        const studentEmails = await prisma.students.findMany({
            select : {
                email : true
            }
        })
        const studentEmailsText = studentEmails.map(r => r.email)
        const teacherLogins = await prisma.teachers.findMany({
            select : {
                login : true
            }
        })
        const teacherLoginsText = teacherLogins.map(r => r.login)
        const teacherEmails = await prisma.teachers.findMany({
            select : {
                email : true
            }
        })
        const teacherEmailsText = teacherEmails.map(r => r.email)
        if (studentLoginsText.indexOf(student.login) === -1 && studentEmailsText.indexOf(student.email) === -1 && teacherEmailsText.indexOf(student.email) === -1 && teacherLoginsText.indexOf(student.login) === -1){
            try {
                await prisma.students.create({
                        data : {
                            name : student.name,
                            nickname : student.nickname,
                            login : student.login,
                            password : hashSync(student.password,12),
                            gender : student.gender,
                            surname : student.surname,
                            email : student.email,
                            age : student.age,
                            description : ''
                        }
                    })
            }
            catch (e){
                console.log(e)
            }
        }
        else {
            throw new NotUniqueLoginError("Ваши логин или почта не уникальны. Попробуйте другой")
        }
    }
    async createTeacher(teacher : Teacher){
        const studentLogins = await prisma.students.findMany({
            select : {
                login : true
            }
        })
        const studentLoginsText = studentLogins.map(r => r.login)
        const studentEmails = await prisma.students.findMany({
            select : {
                email : true
            }
        })
        const studentEmailsText = studentEmails.map(r => r.email)
        const teacherLogins = await prisma.teachers.findMany({
            select : {
                login : true
            }
        })
        const teacherLoginsText = teacherLogins.map(r => r.login)
        const teacherEmails = await prisma.teachers.findMany({
            select : {
                email : true
            }
        })
        const teacherEmailsText = teacherEmails.map(r => r.email)
        try {
            if (teacherEmailsText.indexOf(teacher.email) === -1 && teacherLoginsText.indexOf(teacher.login) === -1 && studentLoginsText.indexOf(teacher.login) === -1 && studentEmailsText.indexOf(teacher.email) === -1){
                await prisma.teachers.create({
                    data : {
                        name : teacher.name,
                        login : teacher.login,
                        password : hashSync(teacher.password,12),
                        surname : teacher.surname,
                        gender : teacher.gender,
                        email : teacher.email,
                        description : '',
                        age : 0
                    }
                })
            }
            else {
                throw new NotUniqueLoginError("Ваши логин или почта не уникальны. Попробуйте другой")
            }
        }
        catch (e){
            console.log(e)
        }
    }
}