"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = exports.loginUser = exports.loginAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = __importDefault(require("../services/userService"));
const saltRounds = 10;
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
const createAdmin = async (req, res, next) => {
    try {
        const { firstname, lastname, email, phoneNumber, password } = req.body;
        if (!firstname || !lastname || !email || !phoneNumber || !password) {
            return res.status(401).json({ message: 'Маш буруу хүсэлт байна.' });
        }
        if (await userService_1.default.findUserByEmail(email)) {
            return res.status(401).json({ message: 'И-мэйл бүртгэлтэй байна.' });
        }
        if (await userService_1.default.findUserByPhoneNum(phoneNumber)) {
            return res.status(401).json({ message: 'Утасны дугаар бүртгэлтэй байна.' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const user = await userService_1.default.createUser(firstname, lastname, email, phoneNumber, hashedPassword);
        const role = await userService_1.default.getRoleByName('admin');
        await userService_1.default.saveUserRole(user.id, role.id);
        return res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.createAdmin = createAdmin;
