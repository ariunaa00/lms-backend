"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.loginAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = __importDefault(require("../services/userService"));
const loginAdmin = async (req, res, next) => {
    try {
        const { email, phoneNumber, password } = req.body;
        if (!email && !phoneNumber || !password) {
            return res.status(401).json({ message: "Мэдээлэл дутуу байна." });
        }
        const user = email ? await userService_1.default.findUserByEmail(email) : await userService_1.default.findUserByPhoneNum(phoneNumber);
        if (!user) {
            return res.status(401).json({ message: "Админ бүртгэлгүй байна." });
        }
        const userPermissions = await userService_1.default.getUserPermissions(user.id);
        console.log(userPermissions);
        if (!userPermissions.includes('login_admin_page')) {
            return res.status(400).json({ message: 'Админ хуудсанд нэвтрэх эрх байхгүй байна.' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ token });
        }
        res.status(401).json({ mesaage: "Нууц үг буруу байна." });
    }
    catch (err) {
        next(err);
    }
};
exports.loginAdmin = loginAdmin;
const loginUser = async (req, res, next) => {
    try {
        const { email, phoneNumber, password } = req.body;
        if (!email && !phoneNumber || !password) {
            return res.status(401).json({ message: "Хэрэглэгчийн мэдээлэл дутуу байна." });
        }
        const user = email ? await userService_1.default.findUserByEmail(email) : await userService_1.default.findUserByPhoneNum(phoneNumber);
        if (!user) {
            return res.status(401).json({ message: "Хэрэглэгч бүртгэлгүй байна." });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ token });
        }
        res.status(401).json({ message: "Нууц үг буруу байна." });
    }
    catch (err) {
        next(err);
    }
};
exports.loginUser = loginUser;
