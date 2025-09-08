import {Router} from "express";
import {IncorrectDataError} from "../errors/IncorrectDataError.js";
import {AuthService} from "./auth.service.js";

const router = Router()
const signin = new AuthService()

router.post('/',async (req,res) => {
    try {
        const result = await signin.authorize(req.body)
        res.status(201).json(result)
    } catch (error){
        if (error instanceof IncorrectDataError){
            res.status(403).json(error.message)
        }
        else {
            res.status(500).json(error)
        }
    }
})

export const loginRouter = router