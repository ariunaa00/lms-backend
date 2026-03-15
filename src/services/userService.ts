import { User } from "@prisma/client";
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
        where: {email}
    })
}

const findUserByPhoneNum = async (phoneNumber): Promise<User | null> => {
    return prisma.user.findFirst({
        where: {phoneNumber}
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

export default { getUserById, createUser, findUserByPhoneNum, findUserByEmail, loginByEmail, loginByPhoneNum };