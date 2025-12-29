import {compareSync} from "bcrypt";
import { PrismaClient } from "../../../generated/prisma/client";
import {IncorrectDataError} from "../errors/IncorrectDataError.js";

type LoginForm = {
    login : string,
    password : string
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

export class AuthService {
    async authorize(loginForm: LoginForm) {
        try {
            const student = await prisma.students.findFirst({
                where: {
                    login: loginForm.login
                }
            });

            if (student && compareSync(loginForm.password, student.password)) {
                return { id: student.id.toString(), role: "student" };
            }
            const teacher = await prisma.teachers.findFirst({
                where: {
                    login: loginForm.login
                }
            });

            if (teacher && compareSync(loginForm.password, teacher.password)) {
                return { id: teacher.id.toString(), role: "teacher" };
            }

            throw new IncorrectDataError('Вы ввели неверные данные. Попробуйте ещё раз');
        } catch (error) {
            if (error instanceof IncorrectDataError) {
                throw error;
            }
            throw new Error('Произошла ошибка при авторизации');
        }
    }
}