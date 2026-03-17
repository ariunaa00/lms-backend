"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const examController_1 = require("../controllers/examController");
const questionController_1 = require("../controllers/questionController");
const config_1 = require("../config");
const router = (0, express_1.Router)();
router.get("/", examController_1.getExamList);
router.post("/", examController_1.saveExam);
router.get('/:examId', questionController_1.getExam);
router.get("/:examId/questions", questionController_1.getQuestionsOfExam);
router.post('/:examId/question', config_1.upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), questionController_1.saveQuestion);
router.post('/:examId/result', examController_1.saveResult);
router.get('/:examId/result', examController_1.getResult);
exports.default = router;
