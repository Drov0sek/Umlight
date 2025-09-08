import {Router} from "express";
import {NotUniqueLoginError} from "../errors/NotUniqueLoginError.js";
import {PasswordTooWeakError} from "../errors/PasswordTooWeakError.js";
import {RegisterService} from "./register.service.js";

const router1 = Router()
const router2 = Router()
const registerUser = new RegisterService()

router1.post('',async (req,res) => {
    try {
        const result = await registerUser.createStudent(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof NotUniqueLoginError){
            res.status(409).json('Логин должен быть уникальным')
        }
        else if (error instanceof PasswordTooWeakError) {
            res.status(400).json(error.message)
        }
        else {
            res.status(500).json('Произошла ошибка. Попробуйте позже');
        }
    }
})
router2.post('',async (req,res) => {
    try {
        const result = await registerUser.createTeacher(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof NotUniqueLoginError){
            res.status(409).json('Логин должен быть уникальным')
        }
        else {
            res.status(500).json('Произошла ошибка. Попробуйте позже');
        }
    }
})
export const registerStudentRouter = router1
export const registerTeacherRouter = router2