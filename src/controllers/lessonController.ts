import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../server";
import lessonService from "../services/lessonService"
import { Request, Response, NextFunction } from "express";

export const getLessonList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await lessonService.getLessonList();
        res.status(200).json(list)
    }
    catch (err) {
        next(err)
    }
}

export const deleteImageFromS3 = async (fileName) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName 
    };
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
}

export const saveLesson = async (req: Request & { file: any }, res: Response, next: NextFunction) => {
    try {

        const lessonImage = req.file
        const lessonName = req.body.lessonName
        const lessonId = req.body.id

        if (lessonId) {
            let lesson = await lessonService.findLessonById(parseInt(lessonId));
            if (lessonImage) {
                const oldImgUrl = lesson.imgUrl;
                
                const params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `lesson/${lesson.id}/${Date.now()}-${lessonImage.originalname}`,
                    Body: lessonImage.buffer,
                    ContentType: lessonImage.mimetype
                };

                const command = new PutObjectCommand(params);
                await s3.send(command);
                lesson = await lessonService.editLesson({ ...lesson, name: lessonName, imgUrl: `/${params.Key}` })
                res.json(lesson);
                await deleteImageFromS3(oldImgUrl);
            } else {
                lesson = await lessonService.editLesson({ ...lesson, name: lessonName })
                res.json(lesson);
            }
            return;
        } else {

            let lesson = await
                lessonService.createLesson({ name: lessonName, imgUrl: null })

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `lesson/${lesson.id}/${Date.now()}-${lessonImage.originalname}`,
                Body: lessonImage.buffer,
                ContentType: lessonImage.mimetype
            };

            const command = new PutObjectCommand(params);
            await s3.send(command);

            lesson = await lessonService.editLesson({ ...lesson, imgUrl: `/${params.Key}` })
            res.json(lesson)
        }

    }
    catch (err) {
        console.log(err);
        res.status(500)
    }
}

