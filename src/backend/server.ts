import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';
import { AuthService } from './authorization/auth.service.js';
import { RegisterService } from './register/register.service.js';
import { GetUserService } from './API/getUserService.js';
import { GetUserInfo } from './userInfo/getUserInfo.js';
import { GetTasksInfo } from './TaskDB/getTasksInfo.js';
import { GetCourseParts } from './Courses/getCourseParts.js';
import { CourseInteraction } from './Courses/courseInteraction.js';
import { IncorrectDataError } from './errors/IncorrectDataError.js';
import { NotUniqueLoginError } from './errors/NotUniqueLoginError.js';
import { PasswordTooWeakError } from './errors/PasswordTooWeakError.js';
import { HasAlreadyJoinedError } from './errors/HasAlreadyJoinedError.js';
import * as http from 'node:http';
import {SetUserInfo} from "./userInfo/setUserInfo.js";

dotenv.config();

declare module "express-session" {
    interface SessionData {
        userId: string;
        role: string;
    }
}

const app = express();
const allowedOrigins = process.env.FRONTEND_ORIGIN?.split(",") ?? [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json());

const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:zar@localhost:5432/umlightDB?schema=public"});

const signin = new AuthService();
const registerUser = new RegisterService();
const getUser = new GetUserService();
const getUserInfo = new GetUserInfo();
const getTasksInfo = new GetTasksInfo();
const getCourseParts = new GetCourseParts();
const courseInteraction = new CourseInteraction();
const setUserInfo = new SetUserInfo()

// CommonJS-safe __dirname
const __dirname = path.resolve();

app.use(session({
    store: new PgSession({ pool: pgPool, tableName: "user_sessions", createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(express.static(path.join(__dirname, "../client")));
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
    app.get('/api/getStudentInfo/:id', async (req, res) => {
        try{
            const result = await getUserInfo.getStudentInfo(Number(req.params.id))
            res.status(200).json(result)
        }catch (e) {
            console.log(e)
            res.status(500).json('Error')
        }
    })
    app.get('/api/getTeacherInfo/:id', async (req, res) => {
        try{
            const result = await getUserInfo.getTeacherInfo(Number(req.params.id))
            res.status(200).json(result)
        }catch (e) {
            console.log(e)
            res.status(500).json('Error')
        }
    })
    app.put('/api/setNewInfo/:id/:role', async (req, res) => {
        const id = Number(req.params.id)
        const role = req.params.role
        const data = req.body
        try{
            const result = await getUserInfo.changeUserInfo(role, id, data)
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.get(`/api/getUserSubjects/:id/:role`, async (req, res) => {
        try {
            const result = await getUserInfo.getUserSubjects(Number(req.params.id), req.params.role)
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getUserCourses/:id/:role', async (req, res) => {
        try {
            const result = await getUserInfo.getUserCourseIds(Number(req.params.id), req.params.role)
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
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
            res.status(500).json(e)
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
    app.get('/api/getTasks', async (_req, res) => {
        try {
            const result = await getTasksInfo.getTasks()
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.get('/api/getTaskById/:id', async (req, res) => {
        try{
            const result = await getTasksInfo.getTaskById(Number(req.params.id))
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.post('/api/setActiveTime', async (req, res) => {
        try {
            const { activeTime, userId, role, userTimeDate } = req.body;
            const result = await getUserInfo.setActiveTime(
                Number(activeTime),
                Number(userId),
                role,
                userTimeDate
            );
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json(e);
        }
    });
    app.get('/api/getActiveTime/:userId/:role',async (req, res) => {
        try{
            const result = await getUserInfo.getActiveTime(Number(req.params.userId), req.params.role)
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    })
    app.post('/api/setUserAnswerRight', async (req, res) => {
        try{
            const {userId, role, taskId, isAnswerRight} = req.body
            const result = await getUserInfo.setUserAnswerRight(Number(userId), role, Number(taskId), isAnswerRight)
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }

    })
    app.get('/api/getUserTasksSubjects/:userId/:role', async (req, res) => {
        try{
            const result = await getUserInfo.getUserTasksSubjects(Number(req.params.userId), req.params.role)
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getUserTasks/:userId/:role', async (req, res) => {
        try{
            const result = await getUserInfo.getUserTasks(Number(req.params.userId), req.params.role)
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getStudentCoursesData/:userId', async (req, res) => {
        try{
            const result = await getUserInfo.getStudentCoursesData(Number(req.params.userId))
            res.status(200).json(result)
        }catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.post('/api/setSeenLesson/:userId/:seenLesson', async (req, res) => {
        try{
            const result = await setUserInfo.setSeenLesson(Number(req.params.userId), Number(req.params.seenLesson))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.post('/api/setDonePracticeLesson/:userId/:practiceLessonId', async (req, res) => {
        try{
            const result = await setUserInfo.setDonePracticeLesson(Number(req.params.userId), Number(req.params.practiceLessonId))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.post('/api/setDonePracticeLessonTask', async (req, res) => {
        try{
            const {userId, lessonTaskId, answer, isAnswerRight} = req.body
            const result = await setUserInfo.setDonePracticeLessonTasks(Number(userId), Number(lessonTaskId), answer, isAnswerRight)
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getUserSeenLessonsAmount/:userId/:courseId', async (req, res) => {
        try{
            const result = await getUserInfo.getSeenLessonsAmount(Number(req.params.userId), Number(req.params.courseId))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getUserSeenModulePercentage/:userId/:courseId', async (req, res) => {
        try{
            const result = await getUserInfo.getSeenModulesPercentage(Number(req.params.userId), Number(req.params.courseId))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getUserDonePracticeLessonsPercentage/:userId/:courseId', async (req, res) => {
        try{
            const result = await getUserInfo.getStudentDonePracticeLessonsPercentages(Number(req.params.userId), Number(req.params.courseId))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getUserTasksAnswerRightData/:userId/:courseId', async (req, res) => {
        try{
            const result = await getUserInfo.getDonePracticeTasksAnswerRightData(Number(req.params.userId), Number(req.params.courseId))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getTeacherStudentsStatsData/:courseId', async (req, res) => {
        try {
            const result = await getUserInfo.getTeacherStudentsAverageStats(Number(req.params.courseId))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getTeacherCourses/:teacherId', async (req, res) => {
        try {
            const result = await getUserInfo.getTeacherCourses(Number(req.params.teacherId))
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.get('/api/getAllTeachers', async (_req, res) => {
        try{
            const result = await getUserInfo.getAllTeachers()
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    })
    app.use((req, res, next) => {
        // Если путь начинается с /api, пропускаем
        if (req.path.startsWith('/api')) return next();

        res.sendFile(
            "index.html",
            { root: path.join(__dirname, "../client") }
        );

    });
}

main().catch(console.error)



const PORT = process.env.PORT || 4200;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('DATABASE_URL =', process.env.DATABASE_URL);
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