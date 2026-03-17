"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExam = exports.saveQuestion = exports.getQuestionsOfExam = exports.getQuestionList = void 0;
const questionService_1 = __importDefault(require("../services/questionService"));
const server_1 = require("../server");
const client_s3_1 = require("@aws-sdk/client-s3");
const lessonController_1 = require("./lessonController");
const examService_1 = __importDefault(require("../services/examService"));
const getQuestionList = async (req, res, next) => {
    try {
        const { examId } = req.body;
        const list = await questionService_1.default.getQuestionList(examId);
        res.status(200).json(list);
    }
    catch (err) {
        next(err);
        res.status(500).json({ message: 'Алдаа гарлаа.' });
    }
};
exports.getQuestionList = getQuestionList;
const getQuestionsOfExam = async (req, res, next) => {
    try {
        const examId = Number(req.params.examId);
        const list = await questionService_1.default.getQuestionList(examId);
        res.status(200).json(list);
    }
    catch (err) {
        next(err);
        res.status(500).json({ message: 'Алдаа гарлаа.' });
    }
};
exports.getQuestionsOfExam = getQuestionsOfExam;
const uploadFileToS3 = async (file, filePrefix) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${filePrefix}${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };
    const command = new client_s3_1.PutObjectCommand(params);
    await server_1.s3.send(command);
    return `${params.Key}`;
};
const saveQuestion = async (req, res, next) => {
    var _a, _b, _c;
    try {
        const examId = parseInt(req.params.examId.toString());
        const question = JSON.parse(req.body.question);
        const answers = JSON.parse(req.body.answers);
        const image = (_a = req.files.image) === null || _a === void 0 ? void 0 : _a[0];
        const audio = (_b = req.files.audio) === null || _b === void 0 ? void 0 : _b[0];
        const video = (_c = req.files.video) === null || _c === void 0 ? void 0 : _c[0];
        if (!question || !answers) {
            return res.status(400).json({ message: 'Мэдээлэл байхгүй байна.' });
        }
        if (question.id) {
            let _question = await questionService_1.default.findQuestionById(parseInt(question.id));
            if (image) {
                question.imgUrl = await uploadFileToS3(image, `exam/${examId}/`);
                await (0, lessonController_1.deleteImageFromS3)(`${_question.imgUrl}`);
            }
            if (audio) {
                question.audioUrl = await uploadFileToS3(audio, `exam/${examId}/`);
                await (0, lessonController_1.deleteImageFromS3)(`${_question.audioUrl}`);
            }
            if (video) {
                question.videoUrl = await uploadFileToS3(video, `exam/${examId}/`);
                await (0, lessonController_1.deleteImageFromS3)(`${_question.videoUrl}`);
            }
            _question = await questionService_1.default.updateQuestion({ ..._question, ...question, id: parseInt(question.id) });
            let newAnswers = [];
            let updateAnswers = [];
            let deletedAnswers = [];
            let _answers = await questionService_1.default.getAnswerList(_question.id);
            answers.map((a) => {
                if (a.id) {
                    a.id = parseInt(a.id);
                    updateAnswers.push({ ...a, updatedAt: new Date() });
                }
                else {
                    newAnswers.push({ ...a, questionId: _question.id });
                }
            });
            _answers.map((a) => {
                if (updateAnswers.findIndex((b) => a.id === b.id) === -1) {
                    deletedAnswers.push(a);
                }
            });
            await questionService_1.default.createAnwers(newAnswers);
            await Promise.all(updateAnswers.map(async (a) => {
                await questionService_1.default.updateAnswer(a);
            }));
            await questionService_1.default.deleteAnswers(deletedAnswers);
            return res.json(_question);
        }
        else {
            let _question = await questionService_1.default.createQuestion({ ...question }, examId);
            let imgUrl = null;
            let audioUrl = null;
            let videoUrl = null;
            if (image) {
                imgUrl = await uploadFileToS3(image, `exam/${examId}/`);
            }
            if (audio) {
                audioUrl = await uploadFileToS3(audio, `exam/${examId}/`);
            }
            if (video) {
                videoUrl = await uploadFileToS3(video, `exam/${examId}/`);
            }
            _question = await questionService_1.default.updateQuestion({ ..._question, imgUrl, audioUrl, videoUrl });
            answers.map(a => {
                a.questionId = _question.id;
            });
            let _answers = await questionService_1.default.createAnwers(answers);
            return res.status(200).json(_question);
        }
        // let _question = await questionService.createQuestion(question);
        // let _answers = await questionService.createAnwers(question.answers.map((a) => a.questionId = question.id))
        // return res.json({ question: _question, answers: _answers })
    }
    catch (err) {
        res.status(500).json({ message: 'Алдаа гарлаа.' });
        next(err);
    }
};
exports.saveQuestion = saveQuestion;
const getExam = async (req, res, next) => {
    try {
        const examId = parseInt(req.params.examId.toString());
        const exam = await examService_1.default.getExam(examId);
        res.json(exam);
    }
    catch (err) {
        next(err);
    }
};
exports.getExam = getExam;
