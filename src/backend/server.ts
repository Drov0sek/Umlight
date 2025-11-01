
import express from 'express'
import cors from 'cors'
import {IncorrectDataError} from "./errors/IncorrectDataError.js";
import {AuthService} from "./authorization/auth.service.js";
import * as http from "node:http";
import {NotUniqueLoginError} from "./errors/NotUniqueLoginError.js";
import {PasswordTooWeakError} from "./errors/PasswordTooWeakError.js";
import {RegisterService} from "./register/register.service.js";
import {GetUserService} from "./API/getUserService.ts";
import {GetCourseParts} from "./Courses/getCourseParts.ts";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/edge";
import {CourseInteraction} from "./Courses/courseInteraction.ts";
import {HasAlreadyJoinedError} from "./errors/HasAlreadyJoinedError.ts";
import connectPgSimple from 'connect-pg-simple';
import session from "express-session";
import pg from "pg";

declare module "express-session" {
    interface SessionData {
        userId: string;
        role: string;
    }
}

const app = express()
app.use(cors({
    origin: "http://localhost:5173", // твой фронт
    credentials: true
}));
app.use(express.json())
const PgSession = connectPgSimple(session);

const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
const signin = new AuthService()
const registerUser = new RegisterService()
const getUser = new GetUserService()
const getCourseParts = new GetCourseParts()
const courseInteraction = new CourseInteraction()

app.use(
    session({
        store: new PgSession({
            pool: pgPool,
            tableName: "user_sessions",
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,  // защищает от XSS
            secure: false,    // только HTTP
            sameSite: "lax", // защита от CSRF - none
            maxAge: 1000 * 60 * 60 * 24 * 1, // 7 дней
        },
    })
);


app.get('/',(req,res) => {
    console.log(req)
    res.send('Server is running');
});

async function main(){
    app.post('/api/login',async (req,res) => {
        try {
            const result = await signin.authorize(req.body)
            req.session.userId = result.id
            req.session.role = result.role
            res.status(201).json(result)
        } catch (error){
            console.error("Error in /api/login:", error);
            if (error instanceof IncorrectDataError){
                res.status(403).json(error.message)
            }
            else {
                res.status(500).json(error)
            }
        }
    })
    app.get('/api/auth', async (req,res) => {
        if (req.session.userId && req.session.role){
            res.status(200).json({userId: req.session.userId, role: req.session.role})
        } else {
            res.status(401).json('session expired')
        }
    })
    app.post('/api/logout', async (req, res) => {
        req.session.destroy(() => {
            res.status(200).json('logout completed')
        })
    })
    app.post('/api/register/student',async (req,res) => {
        try {
            const result = await registerUser.createStudent(req.body);
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof NotUniqueLoginError){
                res.status(409).json('Логин должен быть уникальным')
            }
            else if (error instanceof PasswordTooWeakError) {
                res.status(400).json(error.message)
            }
            else {
                res.status(500).json('Произошла ошибка. Попробуйте позже');
            }
        }
    })
    app.post('/api/register/teacher',async (req,res) => {
        try {
            const result = await registerUser.createTeacher(req.body);
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof NotUniqueLoginError){
                res.status(409).json('Логин должен быть уникальным')
            }
            else {
                res.status(500).json('Произошла ошибка. Попробуйте позже');
            }
        }
    })
    app.get('/api/getUser/:login',async (req,res) => {
        try{
            const result = await getUser.getUser(req.params.login)
            res.status(201).json(result)
        } catch (e) {
            console.log('ghjf',e)
            res.status(501).json(e)
        }
    })
    app.get('/api/getLessons/:moduleName/:courseId',async (req,res) => {
        try{
            const result = await getCourseParts.getModuleLessons(Number(req.params.courseId),req.params.moduleName)
            console.log(result)
            console.log('rfgd')
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.get('/api/getModules/:courseId',async (req,res) => {
        try{
            const result = await getCourseParts.getCourseModules(Number(req.params.courseId))
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.get('/api/getCourseIds', async (req, res) => {
        try{
            const result = await getCourseParts.getCourseIds()
            res.status(200).json(result)
        } catch (e) {
            console.log(e, req.body)
            res.status(500).json(e)
        }
    })
    app.get('/api/getCourseData/:courseId', async (req,res) => {
        try {
            const result = await getCourseParts.getCourseData(Number(req.params.courseId))
            console.log(result)
            res.status(200).json(result)
        }
        catch (e){
            if(e instanceof PrismaClientKnownRequestError){
                res.status(404).json(e)
            }
            else {
                res.status(500).json(e)
            }
        }
    })
    app.get('/api/getCourseStudentsAmount/:courseId',async (req,res) => {
        try{
            const result = await getCourseParts.getCourseStudentsAmount(Number(req.params.courseId))
            console.log(result)
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.get('/api/getCourseLessonsAmount/:courseId',async (req,res) => {
        try {
            const result = await getCourseParts.getCourseLessonsAmount(Number(req.params.courseId))
            res.status(200).json(result)
        }
        catch (e) {
            res.status(500).json(e)
        }
    })
    app.get('/api/getTags/:courseId',async (req,res) => {
        try{
            const result = await getCourseParts.getCourseTags(Number(req.params.courseId))
            console.log(result)
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.post('/api/joinCourse',async (req,res) => {
        try{
            const result = await courseInteraction.joinCourse(req.body)
            res.status(200).json(result)
        } catch (e) {
            if (e instanceof HasAlreadyJoinedError){
                res.status(404).json('Вы уже вступили в этот курс')
            }
            res.status(500).json(e)
        }
    })
    app.get('/api/getLesson/:lessonId',async (req,res) => {
       try {
           const result = await getCourseParts.getLesson(Number(req.params.lessonId))
           res.status(200).json(result)
       } catch (e) {
           if (e instanceof PrismaClientKnownRequestError){
               res.status(404).json(e)
           }
           res.status(500).json(e)
       }
    })
    app.get('/api/getLessonMaterials/:lessonId',async (req,res) => {
        try {
            const result = await getCourseParts.getLessonMaterials(Number(req.params.lessonId))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.post('/api/isInCourse', async (req,res) => {
        try {
            const result = await courseInteraction.isInCourse(req.body)
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.get('/api/getPracticeLesson/:lessonId', async (req,res) => {
        try {
            const result = await getCourseParts.getPracticeLessons(Number(req.params.lessonId))
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.get('/api/getPracticeLessonTasks/:lessonId', async (req, res) => {
        try {
            const result = await getCourseParts.getPraciceLessonTasks(Number(req.params.lessonId))
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
}

main().catch(console.error)
const PORT = process.env.PORT || 4200;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Обработка ошибок при запуске сервера
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Обработка сигналов завершения
process.on('SIGINT', () => {
    console.log('Сервер остановлен');
    server.close(() => {
        process.exit(0);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    server.close(() => {
        process.exit(1);
    });
});