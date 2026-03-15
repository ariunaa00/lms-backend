import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";


export const login = async (req: Request, res: Response, next: NextFunction
) => {
    try {
        const { email, phoneNumber, password } = req.body
        if (!email && !phoneNumber || !password) {
            return res.status(401).json({ message: "Хэрэглэгчийн мэдээлэл дутуу байна." })
        }

        const user = email ? await userService.findUserByEmail(email) : await userService.findUserByPhoneNum(phoneNumber);

        if (!user) {
          return res.status(401).json({ message: "Хэрэглэгч бүртгэлгүй байна." })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )
           return res.json({ token });
        }

        res.status(401).json({ mesaage: "Нууц үг буруу байна." })

    } catch (err) {
        next(err);
    }
}