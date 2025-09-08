import { PrismaClient } from '../../../generated/prisma/client';
import { NoModuleFoundError } from '../errors/NoModuleFoundError.ts';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/edge";

const prisma = new PrismaClient();

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
        return prisma.lesson.findMany({
            where: { id: moduleId }
        });
    }

    async getCourseModules(courseId: number) {
        const moduleIds = await prisma.courses_modules.findMany({
            where: { courseid: courseId },
            select: { moduleid: true }
        }).then(r => r.map(e => e.moduleid));

        if (moduleIds.length === 0) return [];
        const modules = await prisma.modules.findMany({
            where: { id: { in: moduleIds } },
            orderBy: { numofmodule: 'asc' }
        });
        return modules
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

        return prisma.modules.count({
            where: { id: { in: moduleIds } }
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
}
