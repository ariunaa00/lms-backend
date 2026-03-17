"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const findLessonById = async (id) => {
    return db_1.default.lesson.findFirst({
        where: { id }
    });
};
const getLessonList = async () => {
    return db_1.default.lesson.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            deletedAt: null
        },
        include: {
            exams: true
        }
    });
};
const createLesson = async (lesson) => {
    return db_1.default.lesson.create({
        data: lesson
    });
};
const editLesson = async (lesson) => {
    return db_1.default.lesson.update({
        where: {
            id: lesson.id
        },
        data: {
            name: lesson.name,
            imgUrl: lesson.imgUrl,
            createdAt: lesson.createdAt,
        }
    });
};
const deleteLesson = async (lessonId) => {
    return db_1.default.lesson.update({
        where: {
            id: lessonId
        },
        data: { deletedAt: new Date() }
    });
};
exports.default = { findLessonById, getLessonList, createLesson, editLesson, deleteLesson };
