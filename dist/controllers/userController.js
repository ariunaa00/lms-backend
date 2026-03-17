"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.getUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userService_1 = __importDefault(require("../services/userService"));
const saltRounds = 10;
const getUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const user = await userService_1.default.getUserById(id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.getUser = getUser;
const registerUser = async (req, res, next) => {
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
        const role = await userService_1.default.getRoleByName('user');
        await userService_1.default.saveUserRole(user.id, role.id);
        return res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.registerUser = registerUser;
