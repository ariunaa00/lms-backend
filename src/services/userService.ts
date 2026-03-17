import { Role, RolePermissionReg, User, UserRoleReg } from "@prisma/client";
import prisma from "../db";

const getUserById = async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { id },
    });
};

const loginByEmail = async (email, password): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { email, password },
    });
};

const findUserByEmail = async (email): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { email },
    })
}

const findUserByPhoneNum = async (phoneNumber): Promise<User | null> => {
    return prisma.user.findFirst({
        where: { phoneNumber }
    })
}


const loginByPhoneNum = async (phoneNumber, password): Promise<User | null> => {
    return prisma.user.findFirst({
        where: { phoneNumber, password },
    });
};

const createUser = async (firstname: string, lastname: string, email: string, phoneNumber: string, password: string): Promise<User> => {
    return prisma.user.create({
        data: { firstname, lastname, email, phoneNumber, password },
    });
};

const getRoleByName = async (name): Promise<Role | null> => {
    return prisma.role.findFirst({
        where: {
            name
        }
    })
}

const saveUserRole = async (userId, roleId): Promise<UserRoleReg | null> => {
    return prisma.userRoleReg.create({
        data: {
            userId,
            roleId
        }
    })
}

const getUserPermissions = async (userId): Promise<string[] | null> => {

    const role = await prisma.userRoleReg.findFirst({
        where: {
            userId
        }
    })
    if (!role) {
        return []
    }

    let reg = await prisma.rolePermissionReg.findMany({
        where: {
            roleId: role.roleId
        }
    })

    const permissions = await Promise.all(reg.map(async per => {
        const _per = await prisma.permission.findFirst({
            where: {
                id: per.permissionId
            }
        })
        return _per.name;
    }))

    return permissions
}


export default {getUserPermissions,  saveUserRole, getRoleByName, getUserById, createUser, findUserByPhoneNum, findUserByEmail, loginByEmail, loginByPhoneNum };