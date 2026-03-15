import { ExamQuestion } from "@prisma/client"
import prisma from "../db"

const findQuestionById = async (id): Promise<ExamQuestion | null> => {
    return prisma.examQuestion.findFirst({
        where: { id }
    })
};

const getQuestionList = async (examId): Promise<ExamQuestion[] | null> => {
    return prisma.examQuestion.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            examId,
            deletedAt: null
        },
        include: {
            exam: true,
            examAnswers: true
        }
    });
};

const createQuestions = async (questions): Promise<ExamQuestion[] | null> => {
    return prisma.examQuestion.createManyAndReturn({
        data: questions,
        skipDuplicates: true, 
    });
};
const updateQuestions = async (questions): Promise<ExamQuestion[] | null> => {
    return prisma.examQuestion.updateManyAndReturn({
        data: questions
    });
};




const editQuestion = async (question): Promise<ExamQuestion | null> => {
    return prisma.examQuestion.update({
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
    })
};

const deleteQuestion = async (questionId): Promise<ExamQuestion | null> => {
    return prisma.examQuestion.update({
        where: {
            id: questionId
        },
        data: { deletedAt: new Date() }

    })
};
export default { updateQuestions, findQuestionById, getQuestionList, createQuestions, editQuestion, deleteQuestion }