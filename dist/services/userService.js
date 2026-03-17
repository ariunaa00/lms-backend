"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const getUserById = async (id) => {
    return db_1.default.user.findUnique({
        where: { id },
    });
};
const loginByEmail = async (email, password) => {
    return db_1.default.user.findUnique({
        where: { email, password },
    });
};
const findUserByEmail = async (email) => {
    return db_1.default.user.findUnique({
        where: { email },
    });
};
const findUserByPhoneNum = async (phoneNumber) => {
    return db_1.default.user.findFirst({
        where: { phoneNumber }
    });
};
const loginByPhoneNum = async (phoneNumber, password) => {
    return db_1.default.user.findFirst({
        where: { phoneNumber, password },
    });
};
const createUser = async (firstname, lastname, email, phoneNumber, password) => {
    return db_1.default.user.create({
        data: { firstname, lastname, email, phoneNumber, password },
    });
};
const getRoleByName = async (name) => {
    return db_1.default.role.findFirst({
        where: {
            name
        }
    });
};
const saveUserRole = async (userId, roleId) => {
    return db_1.default.userRoleReg.create({
        data: {
            userId,
            roleId
        }
    });
};
const getUserPermissions = async (userId) => {
    const role = await db_1.default.userRoleReg.findFirst({
        where: {
            userId
        }
    });
    if (!role) {
        return [];
    }
    let reg = await db_1.default.rolePermissionReg.findMany({
        where: {
            roleId: role.roleId
        }
    });
    const permissions = await Promise.all(reg.map(async (per) => {
        const _per = await db_1.default.permission.findFirst({
            where: {
                id: per.permissionId
            }
        });
        return _per.name;
    }));
    return permissions;
};
exports.default = { getUserPermissions, saveUserRole, getRoleByName, getUserById, createUser, findUserByPhoneNum, findUserByEmail, loginByEmail, loginByPhoneNum };
