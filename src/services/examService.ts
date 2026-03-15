

import { Exam } from "@prisma/client"
import prisma from "../db"

const findExamById = async (id): Promise<Exam | null> => {
    return prisma.exam.findFirst({
        where: { id }
    })
};

const getExamList = async (): Promise<Exam[] | null> => {
    return prisma.exam.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            deletedAt: null
        }
    });
};

const createExam = async (exam): Promise<Exam | null> => {
    return prisma.exam.create({
        data: exam
    });
};

const updateExam = async (exam): Promise<Exam | null> => {
    return prisma.exam.update({
        where: {
            id: exam.id
        },
        data: {
            name: exam.name,
            lessonId: exam.lessonId,
            duration: exam.duration,
            durationUnit: exam.duration,
            questionNum: exam.questionNum,
            createdAt: exam.createdAt,
        }
    })
};

const deleteExam = async (examId): Promise<Exam | null> => {
    return prisma.exam.update({
        where: {
            id: examId
        },
        data: {deletedAt: new Date() }

    })
};


export default {getExamList, findExamById, createExam, updateExam, deleteExam}