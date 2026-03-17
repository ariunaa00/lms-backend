"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLesson = exports.deleteImageFromS3 = exports.getLessonList = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const server_1 = require("../server");
const lessonService_1 = __importDefault(require("../services/lessonService"));
const examService_1 = __importDefault(require("../services/examService"));
const getLessonList = async (req, res, next) => {
    try {
        const list = await lessonService_1.default.getLessonList();
        res.status(200).json(list);
    }
    catch (err) {
        next(err);
    }
};
exports.getLessonList = getLessonList;
const deleteImageFromS3 = async (fileName) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName
    };
    const command = new client_s3_1.DeleteObjectCommand(params);
    await server_1.s3.send(command);
};
exports.deleteImageFromS3 = deleteImageFromS3;
const saveLesson = async (req, res, next) => {
    try {
        const lessonImage = req.file;
        const lessonName = req.body.lessonName;
        const lessonId = req.body.id;
        if (lessonId) {
            let lesson = await lessonService_1.default.findLessonById(parseInt(lessonId));
            if (lessonImage) {
                const oldImgUrl = lesson.imgUrl;
                const params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `lesson/${lesson.id}/${Date.now()}-${lessonImage.originalname}`,
                    Body: lessonImage.buffer,
                    ContentType: lessonImage.mimetype
                };
                const command = new client_s3_1.PutObjectCommand(params);
                await server_1.s3.send(command);
                lesson = await lessonService_1.default.editLesson({ ...lesson, name: lessonName, imgUrl: `/${params.Key}` });
                res.json(lesson);
                await (0, exports.deleteImageFromS3)(oldImgUrl);
            }
            else {
                lesson = await lessonService_1.default.editLesson({ ...lesson, name: lessonName });
                res.json(lesson);
            }
            return;
        }
        else {
            let lesson = await lessonService_1.default.createLesson({ name: lessonName, imgUrl: null });
            await examService_1.default.createExam({
                lessonId: lesson.id,
                name: `${lesson.name}-шалгалт 1`,
                duration: 10,
                durationUnit: 'min',
                questionNum: 10
            });
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `lesson/${lesson.id}/${Date.now()}-${lessonImage.originalname}`,
                Body: lessonImage.buffer,
                ContentType: lessonImage.mimetype
            };
            const command = new client_s3_1.PutObjectCommand(params);
            await server_1.s3.send(command);
            lesson = await lessonService_1.default.editLesson({ ...lesson, imgUrl: `/${params.Key}` });
            res.json(lesson);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
};
exports.saveLesson = saveLesson;
