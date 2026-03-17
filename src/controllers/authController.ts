import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
const saltRounds = 10;


export const loginAdmin = async (req: Request, res: Response, next: NextFunction
) => {
    try {
        const { email, phoneNumber, password } = req.body
        if (!email && !phoneNumber || !password) {
            return res.status(401).json({ message: "Мэдээлэл дутуу байна." })
        }

        const user = email ? await userService.findUserByEmail(email) : await userService.findUserByPhoneNum(phoneNumber);

        if (!user) {
            return res.status(401).json({ message: "Админ бүртгэлгүй байна." })
        }

        const userPermissions = await userService.getUserPermissions(user.id)

        if (!userPermissions.includes('login_admin_page')) {
            return res.status(400).json({ message: 'Админ хуудсанд нэвтрэх эрх байхгүй байна.' })
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

        res.status(401).json({ message: "Нууц үг буруу байна." })

    } catch (err) {
        next(err);
    }
}


export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { firstname, lastname, email, phoneNumber, password } = req.body

        if (!firstname || !lastname || !email || !phoneNumber || !password) {
            return res.status(401).json({ message: 'Маш буруу хүсэлт байна.' })
        }

        if (await userService.findUserByEmail(email)) {
            return res.status(401).json({ message: 'И-мэйл бүртгэлтэй байна.' })
        }


        if (await userService.findUserByPhoneNum(phoneNumber)) {
            return res.status(401).json({ message: 'Утасны дугаар бүртгэлтэй байна.' })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await userService.createUser(firstname, lastname, email, phoneNumber, hashedPassword)
        const role = await userService.getRoleByName('admin');
        await userService.saveUserRole(user.id, role.id)
        return res.status(200).json(user);

    } catch (err) {
        next(err);
    }
}
