"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const findExamById = async (id) => {
    return db_1.default.exam.findFirst({
        where: { id }
    });
};
const getExamList = async () => {
    return db_1.default.exam.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            deletedAt: null
        },
        include: {
            lesson: true
        }
    });
};
const getExamsByLesson = async (lessonId) => {
    return db_1.default.exam.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            lessonId,
            deletedAt: null
        },
        include: {
            lesson: true
        }
    });
};
const createExam = async (exam) => {
    return db_1.default.exam.create({
        data: exam
    });
};
const getExam = async (id) => {
    return db_1.default.exam.findFirst({
        where: {
            id
        },
        include: {
            examQuestions: {
                include: {
                    examAnswers: true
                }
            }
        }
    });
};
const updateExam = async (exam) => {
    return db_1.default.exam.update({
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
    });
};
const deleteExam = async (examId) => {
    return db_1.default.exam.update({
        where: {
            id: examId
        },
        data: { deletedAt: new Date() }
    });
};
const saveExamResult = async (result, examId, userId) => {
    return db_1.default.examResult.create({
        data: {
            ...result,
            exam: {
                connect: { id: examId }
            },
            user: {
                connect: { id: userId }
            }
        },
    });
};
const getResult = async (userId, examId) => {
    return db_1.default.examResult.findMany({
        where: { userId, examId },
        include: {
            exam: true
        }
    });
};
exports.default = { getResult, saveExamResult, getExam, getExamsByLesson, getExamList, findExamById, createExam, updateExam, deleteExam };
