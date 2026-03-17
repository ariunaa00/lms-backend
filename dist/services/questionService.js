"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const findQuestionById = async (id) => {
    return db_1.default.examQuestion.findFirst({
        where: { id }
    });
};
const getQuestionList = async (examId) => {
    return db_1.default.examQuestion.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            examId,
            deletedAt: null
        },
        include: {
            exam: true,
            examAnswers: {
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });
};
const createQuestion = async (question, examId) => {
    return db_1.default.examQuestion.create({
        data: {
            ...question,
            exam: {
                connect: { id: examId }
            }
        },
    });
};
const updateQuestions = async (questions) => {
    return db_1.default.examQuestion.updateManyAndReturn({
        data: questions
    });
};
const updateQuestion = async (question) => {
    return db_1.default.examQuestion.update({
        where: {
            id: question.id
        },
        data: {
            questionText: question.questionText,
            imgUrl: question.imgUrl,
            audioUrl: question.audioUrl,
            videoUrl: question.videoUrl,
            createdAt: question.createdAt,
        }
    });
};
const deleteQuestion = async (questionId) => {
    return db_1.default.examQuestion.update({
        where: {
            id: questionId
        },
        data: { deletedAt: new Date() }
    });
};
const getAnswerList = async (questionId) => {
    return db_1.default.examAnswer.findMany({
        orderBy: { order: "asc" },
        where: {
            questionId,
            deletedAt: null
        },
    });
};
const createAnwers = async (answers) => {
    return db_1.default.examAnswer.createManyAndReturn({
        data: answers
    });
};
const updateAnswer = async (answer) => {
    return db_1.default.examAnswer.update({
        where: { id: answer.id },
        data: answer
    });
};
const deleteAnswers = async (answers) => {
    return db_1.default.examAnswer.deleteMany({
        where: {
            id: {
                in: answers.map((a) => a.id)
            }
        }
    });
};
exports.default = { deleteAnswers, getAnswerList, updateAnswer, createAnwers, updateQuestions, findQuestionById, getQuestionList, createQuestion, updateQuestion, deleteQuestion };
