import { Request, Response, NextFunction } from "express";
import questionService from "../services/questionService";
import { s3 } from "../server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { deleteImageFromS3 } from "./lessonController";

export const getQuestionList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { examId } = req.body;
        const list = await questionService.getQuestionList(examId);
        res.status(200).json(list)

    } catch (err) {
        next(err)
        res.status(500).json({ message: 'Алдаа гарлаа.' })
    }
}


export const getQuestionsOfExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const examId = Number(req.params.examId);
        const list = await questionService.getQuestionList(examId);
        res.status(200).json(list)

    } catch (err) {
        next(err)
        res.status(500).json({ message: 'Алдаа гарлаа.' })
    }
}
const uploadFileToS3 = async (file, filePrefix) => {

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${filePrefix}${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `${params.Key}`
}

export const saveQuestion = async (req: Request & { files: any }, res: Response, next: NextFunction) => {
    try {
        const examId = parseInt(req.params.examId.toString())
        const question = JSON.parse(req.body.question);
        const answers = JSON.parse(req.body.answers);

        const image = req.files.image?.[0];
        const audio = req.files.audio?.[0];
        const video = req.files.video?.[0];

        if (!question || !answers) {
            return res.status(400).json({ message: 'Мэдээлэл байхгүй байна.' })
        }

        if (question.id) {
            let _question = await questionService.findQuestionById(parseInt(question.id))

            if (image) {
                question.imgUrl = await uploadFileToS3(image, `exam/${examId}/`)
                await deleteImageFromS3(`${_question.imgUrl}`)
            }

            if (audio) {
                question.audioUrl = await uploadFileToS3(audio, `exam/${examId}/`)
                await deleteImageFromS3(`${_question.audioUrl}`)
            }

            if (video) {
                question.videoUrl = await uploadFileToS3(video, `exam/${examId}/`)
                await deleteImageFromS3(`${_question.videoUrl}`)
            }

            _question = await questionService.updateQuestion({ ..._question, ...question, id: parseInt(question.id) })
            let newAnswers = []
            let updateAnswers = []
            let deletedAnswers = []

            let _answers = await questionService.getAnswerList(_question.id);

            answers.map((a) => {
                if (a.id) {
                    a.id = parseInt(a.id)
                    updateAnswers.push({...a, updatedAt: new Date()})
                } else {
                    newAnswers.push({...a, questionId: _question.id})
                }
            })

            _answers.map((a) => {
                if (updateAnswers.findIndex((b) => a.id === b.id) === -1) {
                    deletedAnswers.push(a)
                }
            })

            await questionService.createAnwers(newAnswers)
            await Promise.all(updateAnswers.map(async(a) => {
                await questionService.updateAnswer(a)
            }))
            await questionService.deleteAnswers(deletedAnswers);
            return res.json(_question);


        } else {
            let _question = await questionService.createQuestion({ ...question }, examId)
            let imgUrl = null
            let audioUrl = null
            let videoUrl = null

            if (image) {
                imgUrl = await uploadFileToS3(image, `exam/${examId}/`)
            }
            if (audio) {
                audioUrl = await uploadFileToS3(audio, `exam/${examId}/`)
            }

            if (video) {
                videoUrl = await uploadFileToS3(video, `exam/${examId}/`)
            }

            _question = await questionService.updateQuestion({ ..._question, imgUrl, audioUrl, videoUrl })
            answers.map(a => {
                a.questionId = _question.id
            })

            let _answers = await questionService.createAnwers(answers)
            return res.status(200).json(_question)
        }

        // let _question = await questionService.createQuestion(question);
        // let _answers = await questionService.createAnwers(question.answers.map((a) => a.questionId = question.id))
        // return res.json({ question: _question, answers: _answers })

    } catch (err) {
        res.status(500).json({ message: 'Алдаа гарлаа.' })
        next(err)
    }
}