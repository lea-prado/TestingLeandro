import { usersService } from "../services/index.js";
import logger from "../utils/logger.js";
import CustomError, { ErrorDictionary } from "../utils/CustomError.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const getAllUsers = asyncHandler(async(req,res) => {
    logger.info('Getting all users');
    const users = await usersService.getAll();
    logger.info(`Retrieved ${users.length} users`);
    res.send({status:"success",payload:users});
});

const getUser = asyncHandler(async(req,res) => {
    const userId = req.params.uid;
    logger.info(`Getting user with ID: ${userId}`);
    
    if (!userId) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'ID de usuario es requerido',
            code: 400
        });
    }
    
    const user = await usersService.getUserById(userId);
    if(!user) {
        logger.warn(`User not found: ${userId}`);
        CustomError.createError({
            name: 'NotFoundError',
            message: ErrorDictionary.USER_NOT_FOUND.message,
            code: ErrorDictionary.USER_NOT_FOUND.code
        });
    }
    
    logger.info(`User found: ${userId}`);
    res.send({status:"success",payload:user});
});

const updateUser = asyncHandler(async(req,res) => {
    const updateBody = req.body;
    const userId = req.params.uid;
    logger.info(`Updating user: ${userId}`);
    
    if (!userId) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'ID de usuario es requerido',
            code: 400
        });
    }
    
    if (!updateBody || Object.keys(updateBody).length === 0) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'Datos de actualización son requeridos',
            code: 400
        });
    }
    
    const user = await usersService.getUserById(userId);
    if(!user) {
        logger.warn(`User not found for update: ${userId}`);
        CustomError.createError({
            name: 'NotFoundError',
            message: ErrorDictionary.USER_NOT_FOUND.message,
            code: ErrorDictionary.USER_NOT_FOUND.code
        });
    }
    
    // Prevenir actualización de campos sensibles sin validación adicional
    if (updateBody.password) {
        logger.warn(`Attempt to update password without proper validation for user: ${userId}`);
        CustomError.createError({
            name: 'ValidationError',
            message: 'Para cambiar la contraseña use el endpoint específico',
            code: 400
        });
    }
    
    if (updateBody.email && updateBody.email !== user.email) {
        // Verificar que el nuevo email no esté en uso
        const existingUser = await usersService.getUserByEmail(updateBody.email);
        if (existingUser) {
            logger.warn(`Email already in use: ${updateBody.email}`);
            CustomError.createError({
                name: 'ConflictError',
                message: 'El email ya está en uso',
                code: 409
            });
        }
    }
    
    const result = await usersService.update(userId,updateBody);
    logger.info(`User updated successfully: ${userId}`);
    res.send({status:"success",message:"User updated", userId});
});

const deleteUser = asyncHandler(async(req,res) => {
    const userId = req.params.uid;
    logger.info(`Deleting user: ${userId}`);
    
    if (!userId) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'ID de usuario es requerido',
            code: 400
        });
    }
    
    const user = await usersService.getUserById(userId);
    if(!user) {
        logger.warn(`User not found for deletion: ${userId}`);
        CustomError.createError({
            name: 'NotFoundError',
            message: ErrorDictionary.USER_NOT_FOUND.message,
            code: ErrorDictionary.USER_NOT_FOUND.code
        });
    }
    
    // Aquí podríamos añadir lógica adicional como:
    // - Verificar si el usuario tiene adopciones activas
    // - Manejar las mascotas asociadas
    // - etc.
    
    const result = await usersService.delete(userId);
    logger.info(`User deleted successfully: ${userId}`);
    res.send({status:"success",message:"User deleted", userId});
});

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
};