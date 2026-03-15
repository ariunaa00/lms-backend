import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
const saltRounds = 10;

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);

  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { firstname, lastname, email, password, phoneNumber } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await userService.createUser(firstname, lastname, email, phoneNumber, hashedPassword);
    res.status(201).json(user);

  } catch (err) {
    next(err);
  }
};