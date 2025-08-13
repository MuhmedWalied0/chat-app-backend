import express from 'express';
import validate from '../middlewares/validate.js';
import { registerSchema,loginSchema } from '../schemas/auth.js';
import { login, register } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router=express.Router()

router.post("/login",validate(loginSchema),login)

router.post("/register",validate(registerSchema),register)


export default router