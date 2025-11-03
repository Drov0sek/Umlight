import { PrismaClient } from '../../../generated/prisma/client';
import { NoModuleFoundError } from '../errors/NoModuleFoundError.js';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/edge";

const prisma = new PrismaClient();

type ModuleType = {
    numberOfModule : number,
    name : string,
    numberOfLessons : number
}

async function getModuleIdByName(moduleName: string, courseId: number) {
    const courseModuleIds = await prisma.courses_modules.findMany({
        where: { courseid: courseId },
        select: { moduleid: true }
    }).then(r => r.map(e => e.moduleid));

    const moduleRow = await prisma.modules.findFirst({
        where: { id: { in: courseModuleIds }, name: moduleName },
        select: { id: true }
    });

    if (!moduleRow) {
        throw new NoModuleFoundError('С сервером какие-то неполадки');
    }

    return moduleRow.id;
}

export class GetCourseParts {
    async getModuleLessons(courseId: number, moduleName: string) {
        const moduleId = await getModuleIdByName(moduleName, courseId);

        // достаём id всех уроков из таблицы modules_lessons
        const lessonIds = await prisma.modules_lessons.findMany({
            where: { moduleid: moduleId },
            select: { lessonid: true }
        }).then(r => r.map(e => e.lessonid));

        console.log('Module:', moduleName, 'ModuleID:', moduleId, 'LessonIDs:', lessonIds);

        if (lessonIds.length === 0) {
            console.warn('⚠️ Нет уроков для модуля', moduleName);
            return [];
        }

        // достаём уроки
        const lessons = await prisma.lesson.findMany({
            where: { id: { in: lessonIds } },
            orderBy: { numberoflesson: 'asc' }
        });

        console.log('Lessons found:', lessons.length);
        return lessons;
    }

    async getCourseModules(courseId: number) {
        const moduleIds = await prisma.courses_modules.findMany({
            where: { courseid: courseId },
            select: { moduleid: true }
        }).then(r => r.map(e => e.moduleid));
        const dbModules = await prisma.modules.findMany({
            where: { id: { in: moduleIds } },
            orderBy: { numberofmodule: 'asc' }
        });
        const modules : ModuleType[] = []
        for (let i = 0;i < dbModules.length; i++){
            const moduleLessons = await prisma.modules_lessons.count({
                where : {
                    moduleid : dbModules[i].id
                }
            })
            const module : ModuleType = {name : dbModules[i].name, numberOfModule : dbModules[i].numberofmodule, numberOfLessons : moduleLessons}
            modules.push(module)
        }
        return modules
    }
    async getCourseIds(){
        const courseIds = await prisma.courses.findMany({
            select : {
                id : true
            }
        }).then(e => e.map(r => r.id))
        return courseIds
    }

    async getCourseData(courseId: number) {
        const course = await prisma.courses.findUniqueOrThrow({
            where: { id: courseId },
            select: {
                id: true,
                name: true,
                description: true,
                titleImage: true,
                time: true,
                authorid: true
            }
        });

        const author = await prisma.teachers.findUniqueOrThrow({
            where: { id: course.authorid },
            select: { name: true, surname: true }
        });

        return {
            courseId: course.id,
            courseName: course.name,
            courseDescription: course.description,
            titleImage: course.titleImage,
            courseTime: course.time,
            courseAuthor: {
                authorName: author.name,
                authorSurname: author.surname
            }
        };
    }

    async getCourseStudentsAmount(courseId: number) {
        return prisma.courses_students.count({
            where: { courseid: courseId }
        });
    }

    async getCourseLessonsAmount(courseId: number) {
        const moduleIds = await prisma.courses_modules.findMany({
            where: { courseid: courseId },
            select: { moduleid: true }
        }).then(r => r.map(e => e.moduleid));

        if (moduleIds.length === 0) return 0;

        return prisma.modules_lessons.count({
            where: { moduleid: { in: moduleIds } }
        });
    }

    async getCourseTags(courseId: number) {
        const tagIds = await prisma.courses_tags.findMany({
            where: { courseid: courseId },
            select: { tagid: true }
        }).then(e => e.map(r => r.tagid));

        if (tagIds.length === 0) return [];

        const rows = await prisma.tags.findMany({
            where: { id: { in: tagIds } },
            select: { tag: true }
        });

        return rows.map(t => t.tag || '');
    }
    async getLesson(lessonId : number){
        try {
            const lesson = await prisma.lesson.findFirstOrThrow({
                where : {
                    id : lessonId
                }
            })
            return lesson
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError){
                throw new PrismaClientKnownRequestError('',{code : 'P2025', meta :{ modelName: 'students', cause: 'No record was found for a query.' },clientVersion : '6.10.1'})
            }
            throw new Error()
        }
    }
    async getLessonMaterials(lessonId : number){
        try{
            const materialsId = await prisma.lessons_materials.findMany({
                where : {
                    lessonid : lessonId
                }
            }).then(e => e.map(r => r.materialid))
            const materials = await prisma.materials.findMany({
                where : {
                    id : {
                        in : materialsId
                    }
                }
            })
            return materials
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
    async getPracticeLessons(lessonId : number){
        try {
            const practiceLesson = await prisma.lesson.findFirst({
                where : {
                    id : lessonId,
                    type : 'Практика'
                },
                select : {
                    id : true,
                    name : true,
                    type : true,
                    description : true,
                    time : true,
                    numberoflesson : true
                }
            })
            return practiceLesson
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
    async getPraciceLessonTasks(lessonId : number){
        try {
            const lessonTasks = await prisma.lesson_tasks.findMany({
                where : {
                    lesson_id : lessonId
                },
                select : {
                    id : true,
                    text : true,
                    image : true,
                    answer : true,

                }
            })
            return lessonTasks
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
}
