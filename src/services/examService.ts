

import { Exam, ExamResult } from "@prisma/client"
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
        },
        include: {
            lesson: true
        }
    });
};

const getExamsByLesson = async (lessonId): Promise<Exam[] | null> => {
    return prisma.exam.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            lessonId,
            deletedAt: null
        },
        include: {
            lesson: true
        }
    });
}

const createExam = async (exam): Promise<Exam | null> => {
    return prisma.exam.create({
        data: exam
    });
};

const getExam = async (id): Promise<Exam | null> => {
    return prisma.exam.findFirst({
        where: {
            id
        },
        include: {
            examQuestions: {
                include: {
                    examAnswers: true
                },
                take: 10
            }
        }
    })
}

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
        data: { deletedAt: new Date() }

    })
};

const saveExamResult = async (result, examId, userId): Promise<ExamResult | null> => {
    return prisma.examResult.create({
        data: {
            ...result,
            exam: {
                connect: { id: examId }
            },
            user: {
                connect: { id: userId }
            }
        },

    })
};

const getResult = async (userId, examId): Promise<ExamResult[] | null> => {
    return prisma.examResult.findMany({
        where: { userId, examId },
        include: {
            exam: true
        }
    })
}

const getAllResult = async (): Promise<ExamResult[] | null> => {
    return prisma.examResult.findMany({
        include: {
            exam: true
        }
    })
}


export default { getResult, getAllResult, saveExamResult, getExam, getExamsByLesson, getExamList, findExamById, createExam, updateExam, deleteExam }