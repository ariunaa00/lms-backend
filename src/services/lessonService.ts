import { Lesson } from "@prisma/client"
import prisma from "../db"



const findLessonById = async (id): Promise<Lesson | null> => {
    return prisma.lesson.findFirst({
        where: { id }
    })
};

const getLessonList = async (): Promise<Lesson[] | null> => {
    return prisma.lesson.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            deletedAt: null
        }
    });
};

const createLesson = async (lesson): Promise<Lesson | null> => {
    return prisma.lesson.create({
        data: lesson
    });
};

const editLesson = async (lesson): Promise<Lesson | null> => {
    return prisma.lesson.update({
        where: {
            id: lesson.id
        },
        data: {
            name: lesson.name,
            imgUrl: lesson.imgUrl,
            createdAt: lesson.createdAt,
        }
    })
};

const deleteLesson = async (lessonId): Promise<Lesson | null> => {
    return prisma.lesson.update({
        where: {
            id: lessonId
        },
        data: {deletedAt: new Date() }

    })
};
export default { findLessonById, getLessonList, createLesson, editLesson, deleteLesson }