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

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {firstname, lastname, email, phoneNumber, password} = req.body;
        if(!firstname || !lastname || !email || !phoneNumber || !password){
            return res.status(401).json({message: 'Маш буруу хүсэлт байна.'})
        }

        if(await userService.findUserByEmail(email)){
            return res.status(401).json({message: 'И-мэйл бүртгэлтэй байна.'})
        }

        
        if(await userService.findUserByPhoneNum(phoneNumber)){
            return res.status(401).json({message: 'Утасны дугаар бүртгэлтэй байна.'})
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await userService.createUser(firstname, lastname, email, phoneNumber, hashedPassword)
        
        const role = await userService.getRoleByName('user');
        await userService.saveUserRole(user.id, role.id)
        
        return res.status(200).json(user);
    } catch(err) {
        next(err)
    }
}