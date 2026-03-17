import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";


export const loginAdmin = async (req: Request, res: Response, next: NextFunction
) => {
    try {
        const { email, phoneNumber, password } = req.body
        if (!email && !phoneNumber || !password ) {
            return res.status(401).json({ message: "Мэдээлэл дутуу байна." })
        }

        const user = email ? await userService.findUserByEmail(email) : await userService.findUserByPhoneNum(phoneNumber);

        if (!user) {
          return res.status(401).json({ message: "Админ бүртгэлгүй байна." })
        }
        
        const userPermissions = await userService.getUserPermissions(user.id)

        console.log(userPermissions);

        if(!userPermissions.includes('login_admin_page')){
            return res.status(400).json({message: 'Админ хуудсанд нэвтрэх эрх байхгүй байна.'})
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

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const { email, phoneNumber, password } = req.body
        if (!email && !phoneNumber || !password ) {
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

        res.status(401).json({ message: "Нууц үг буруу байна." })

    } catch (err) {
        next(err);
    }
}

