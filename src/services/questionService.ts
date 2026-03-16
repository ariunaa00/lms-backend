import { Exam, ExamAnswer, ExamQuestion } from "@prisma/client"
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
            examAnswers: {
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });
};

const createQuestion = async (question, examId): Promise<ExamQuestion | null> => {
    return prisma.examQuestion.create({
        data: {
            ...question,
            exam: {
                connect: { id: examId }
            }
        },
    });
};

const updateQuestions = async (questions): Promise<ExamQuestion[] | null> => {
    return prisma.examQuestion.updateManyAndReturn({
        data: questions
    });
};




const updateQuestion = async (question): Promise<ExamQuestion | null> => {
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
const getAnswerList = async (questionId): Promise<ExamAnswer[] | null> => {
    return prisma.examAnswer.findMany({
        orderBy: { order: "asc" },
        where: {
            questionId,
            deletedAt: null
        },
    });
};

const createAnwers = async (answers): Promise<ExamAnswer[] | null> => {
    return prisma.examAnswer.createManyAndReturn({
        data: answers
    });
};

const updateAnswer = async (answer): Promise<ExamAnswer | null> => {
    return prisma.examAnswer.update({
        where: {id: answer.id},
        data: answer
    });
};

const deleteAnswers = async (answers): Promise<any> => {
    return prisma.examAnswer.deleteMany({
        where: {
            id: {
                in: answers.map((a) => a.id)
            }
        }
    });
}; 
export default { deleteAnswers, getAnswerList, updateAnswer, createAnwers, updateQuestions, findQuestionById, getQuestionList, createQuestion, updateQuestion, deleteQuestion }