import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import logger from "../utils/logger.js";
import CustomError, { ErrorDictionary } from "../utils/CustomError.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || 'tokenSecretJWT';

const register = asyncHandler(async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    logger.info(`Attempting to register user: ${email}`);
    
    if (!first_name || !last_name || !email || !password) {
        logger.warn('Incomplete registration data provided');
        CustomError.createError({
            name: 'ValidationError',
            message: 'Todos los campos son requeridos: first_name, last_name, email, password',
            code: 400
        });
    }
    
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        logger.warn(`Invalid email format: ${email}`);
        CustomError.createError({
            name: 'ValidationError',
            message: 'Formato de email inválido',
            code: 400
        });
    }
    
    const exists = await usersService.getUserByEmail(email);
    if (exists) {
        logger.warn(`User already exists: ${email}`);
        CustomError.createError({
            name: 'ConflictError',
            message: 'El usuario ya existe',
            code: 409
        });
    }
    
    const hashedPassword = await createHash(password);
    const user = {
        first_name,
        last_name,
        email,
        password: hashedPassword
    };
    
    let result = await usersService.create(user);
    logger.info(`User registered successfully: ${email} with ID: ${result._id}`);
    res.status(201).send({ status: "success", payload: result._id });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    logger.info(`Login attempt for user: ${email}`);
    
    if (!email || !password) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'Email y password son requeridos',
            code: 400
        });
    }
    
    const user = await usersService.getUserByEmail(email);
    if(!user) {
        logger.warn(`Login failed - user not found: ${email}`);
        CustomError.createError({
            name: 'AuthenticationError',
            message: ErrorDictionary.INVALID_CREDENTIALS.message,
            code: ErrorDictionary.INVALID_CREDENTIALS.code
        });
    }
    
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) {
        logger.warn(`Login failed - invalid password for user: ${email}`);
        CustomError.createError({
            name: 'AuthenticationError',
            message: ErrorDictionary.INVALID_CREDENTIALS.message,
            code: ErrorDictionary.INVALID_CREDENTIALS.code
        });
    }
    
    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, JWT_SECRET, {expiresIn:"1h"});
    
    logger.info(`User logged in successfully: ${email}`);
    res.cookie('coderCookie',token,{
        maxAge:3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }).send({status:"success",message:"Logged in"});
});

const current = asyncHandler(async(req,res) => {
    const cookie = req.cookies['coderCookie'];
    
    if (!cookie) {
        logger.warn('No authentication cookie found');
        CustomError.createError({
            name: 'AuthenticationError',
            message: 'No se encontró token de autenticación',
            code: 401
        });
    }
    
    try {
        const user = jwt.verify(cookie, JWT_SECRET);
        logger.info(`Current user retrieved: ${user.email}`);
        res.send({status:"success",payload:user});
    } catch (error) {
        logger.warn('Invalid or expired token');
        CustomError.createError({
            name: 'AuthenticationError',
            message: 'Token inválido o expirado',
            code: 401
        });
    }
});

const unprotectedLogin = asyncHandler(async(req,res) => {
    const { email, password } = req.body;
    logger.info(`Unprotected login attempt for user: ${email}`);
    
    if (!email || !password) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'Email y password son requeridos',
            code: 400
        });
    }
    
    const user = await usersService.getUserByEmail(email);
    if(!user) {
        logger.warn(`Unprotected login failed - user not found: ${email}`);
        CustomError.createError({
            name: 'AuthenticationError',
            message: ErrorDictionary.INVALID_CREDENTIALS.message,
            code: ErrorDictionary.INVALID_CREDENTIALS.code
        });
    }
    
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) {
        logger.warn(`Unprotected login failed - invalid password for user: ${email}`);
        CustomError.createError({
            name: 'AuthenticationError',
            message: ErrorDictionary.INVALID_CREDENTIALS.message,
            code: ErrorDictionary.INVALID_CREDENTIALS.code
        });
    }
    
    const token = jwt.sign(user.toObject(), JWT_SECRET, {expiresIn:"1h"});
    
    logger.info(`User logged in (unprotected) successfully: ${email}`);
    res.cookie('unprotectedCookie',token,{
        maxAge:3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }).send({status:"success",message:"Unprotected Logged in"});
});

const unprotectedCurrent = asyncHandler(async(req,res) => {
    const cookie = req.cookies['unprotectedCookie'];
    
    if (!cookie) {
        logger.warn('No unprotected authentication cookie found');
        CustomError.createError({
            name: 'AuthenticationError',
            message: 'No se encontró token de autenticación',
            code: 401
        });
    }
    
    try {
        const user = jwt.verify(cookie, JWT_SECRET);
        logger.info(`Current unprotected user retrieved: ${user.email}`);
        res.send({status:"success",payload:user});
    } catch (error) {
        logger.warn('Invalid or expired unprotected token');
        CustomError.createError({
            name: 'AuthenticationError',
            message: 'Token inválido o expirado',
            code: 401
        });
    }
});

const logout = asyncHandler(async(req,res) => {
    logger.info('User logging out');
    res.clearCookie('coderCookie').send({
        status: "success",
        message: "Logged out successfully"
    });
});

export default {
    current,
    login,
    register,
    unprotectedLogin,
    unprotectedCurrent,
    logout
};