import express from "express";
import multer from "multer";
import { PrismaClient } from "../../../generated/prisma/client";

const storage = multer.diskStorage({
    destination : (_req, _file, callback) => {
        callback(null, 'C://projects/courseMaterials/img/contentImages')
    },
    filename(_req, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        callback(null, file.originalname)
    }
})
const upload = multer({storage : storage});
const router = express.Router();
const prisma = new PrismaClient()

router.post(
    "/createCourse",
    upload.any(),
    async (req, res) => {
        try {
            console.log("SESSION USER ID:", req.session?.userId);

            if (!req.session?.userId) {
                return res.status(401).json({ error: "Not authenticated" });
            }

            const meta = JSON.parse(req.body.meta);
            const files = req.files as Express.Multer.File[];
            console.log('files: ', files)

            console.log("Creating course with data:", meta);
            const result = await prisma.$transaction(async (tx) => {
                const course = await tx.courses.create({
                    data: {
                        name: meta.name ?? "Новый курс без названия",
                        description: meta.description ?? "",
                        titleImage: "", // <-
                        time: meta.time,
                        authorid: Number(req.session.userId),
                    },
                });

                console.log("Course created with ID:", course.id);
                // if (meta.tags && Array.isArray(meta.tags)) {
                //     for (const tagName of meta.tags) {
                //         if (!tagName || typeof tagName !== 'string') continue;
                //
                //         const trimmedTag = tagName.trim();
                //         if (!trimmedTag) continue;
                //
                //         // Используем upsert для тегов
                //         // const tag = await tx.tags.upsert({
                //         //     where: { tag: trimmedTag },
                //         //     update: {},
                //         //     create: { tag: trimmedTag },
                //         // });
                //
                //         // Связываем тег с курсом (если еще не связан)
                //         const existingCourseTag = await tx.courses_tags.findFirst({
                //             where: {
                //                 courseid: course.id,
                //                 tagid: tag.id,
                //             }
                //         });
                //
                //         if (!existingCourseTag) {
                //             await tx.courses_tags.create({
                //                 data: {
                //                     courseid: course.id,
                //                     tagid: tag.id,
                //                 },
                //             });
                //         }
                //     }
                // }
                if (meta.modules && Array.isArray(meta.modules)) {
                    for (const moduleData of meta.modules) {
                        const module = await prisma.modules.create({
                            data : {
                                name: moduleData.name,
                                numberofmodule: moduleData.numberOfModule,
                            }
                        })
                        const existingCourseModule = await tx.courses_modules.findFirst({
                            where: {
                                courseid: course.id,
                                moduleid: module.id,
                            }
                        });

                        if (!existingCourseModule) {
                            await tx.courses_modules.create({
                                data: {
                                    courseid: course.id,
                                    moduleid: module.id,
                                },
                            });
                        }
                        const lessons = meta.moduleLessons?.[moduleData.name] || [];

                        for (const lessonData of lessons) {
                            const lesson = await tx.lesson.create({
                                data: {
                                    name: lessonData.name,
                                    type: lessonData.type,
                                    description: lessonData.description || "",
                                    video: lessonData.video || "",
                                    time: lessonData.time || 0,
                                    numberoflesson: lessonData.numberoflesson,
                                },
                            });
                            await tx.modules_lessons.create({
                                data: {
                                    moduleid: module.id,
                                    lessonid: lesson.id,
                                },
                            });
                            const publicTasks = meta.lessonPublicTasks?.filter(
                                (task: any) =>
                                    task.moduleName === moduleData.name &&
                                    task.numberOfLesson === lessonData.numberoflesson
                            ) || [];
                            const publicTasksByPublicId = new Map<number, any>();
                            for (const task of publicTasks) {
                                if (!publicTasksByPublicId.has(task.publicTaskId)) {
                                    publicTasksByPublicId.set(task.publicTaskId, task);
                                } else {
                                    console.log(`Skipping duplicate public task ID: ${task.publicTaskId}`);
                                }
                            }
                            for (const [publicTaskId, task] of publicTasksByPublicId.entries()) {
                                const publicTask = await tx.public_tasks.findUnique({
                                    where: { id: publicTaskId }
                                });

                                if (publicTask) {
                                    const existingLessonTask = await tx.lesson_tasks.findFirst({
                                        where: {
                                            lesson_id: lesson.id,
                                            text: publicTask.text,
                                        }
                                    });

                                    if (!existingLessonTask) {
                                        try {
                                            await tx.lesson_tasks.create({
                                                data: {
                                                    text: publicTask.text,
                                                    image: publicTask.image || "",
                                                    answer: publicTask.answer ?? "",
                                                    lesson_id: lesson.id,
                                                },
                                            });
                                        } catch (error: any) {
                                            if (error.code === 'P2002') {
                                                // Логируем и продолжаем
                                                console.log(`Duplicate detected and skipped: ${publicTask.text.substring(0, 50)}...`);
                                                continue;
                                            }
                                            throw error;
                                        }
                                    }
                                }
                            }
                            const ownTasks = meta.lessonOwnTasks?.filter(
                                (task: any) =>
                                    task.moduleName === moduleData.name &&
                                    task.numberOfLesson === lessonData.numberoflesson
                            ) || [];
                            console.log(meta.lessonOwnTasks)
                            const seenTasks = new Set<string>();
                            const uniqueOwnTasks = ownTasks.filter(task => {
                                const key = `${task.taskText}|${task.answer}`; // Создаем уникальный ключ
                                if (seenTasks.has(key)) {
                                    return false;
                                }
                                seenTasks.add(key);
                                return true;
                            });

                            for (const task of uniqueOwnTasks) {
                                const existingLessonTask = await tx.lesson_tasks.findFirst({
                                    where: {
                                        lesson_id: lesson.id,
                                        text: task.taskText,
                                    }
                                });

                                if (!existingLessonTask) {
                                    try {
                                        await tx.lesson_tasks.create({
                                            data: {
                                                text: task.taskText,
                                                image: `http://localhost8080/taskImages/${files[0].originalname}`,
                                                answer: task.answer || "",
                                                lesson_id: lesson.id,
                                            },
                                        });
                                    } catch (error: any) {
                                        if (error.code === 'P2002') {
                                            console.log(`Duplicate own task skipped: ${task.taskText.substring(0, 50)}...`);
                                            continue;
                                        }
                                        throw error;
                                    }
                                }
                            }
                            const lessonMats = meta.lessonsMaterials?.find(
                                (m: any) => m.numberOfLesson === lessonData.numberoflesson
                            );

                            if (lessonMats && Array.isArray(lessonMats.materialNames)) {
                                for (const matName of lessonMats.materialNames) {
                                    // Проверяем, не существует ли уже такой материал
                                    const existingMaterial = await tx.materials.findFirst({
                                        where: {
                                            materialName: matName,
                                        }
                                    });

                                    if (!existingMaterial) {
                                        const material = await tx.materials.create({
                                            data: {
                                                materialName: matName,
                                            },
                                        });

                                        await tx.lessons_materials.create({
                                            data: {
                                                lessonid: lesson.id,
                                                materialid: material.id,
                                            },
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                return { courseId: course.id };
            });

            res.json({ success: true, data: result });

        } catch (error: any) {
            console.error("Error creating course:", error);
            console.error("Error details:", {
                code: error.code,
                message: error.message,
                meta: error.meta,
                stack: error.stack
            });
            if (error.code === 'P2002') {
                console.error("Possible unique constraints in lesson_tasks:");
                console.error("1. Field 'id' - autoincrement");
                console.error("2. Check for @@unique constraints in schema");
                console.error("3. Maybe duplicate lesson_id + text combination");
            }

            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
);
router.get("/test", (_req, res) => {
    res.json({ message: "Create course router is working!" });
});

export default router;