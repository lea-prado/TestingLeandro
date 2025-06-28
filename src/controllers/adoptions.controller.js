import { adoptionsService, petsService, usersService } from "../services/index.js";
import logger from "../utils/logger.js";
import CustomError, { ErrorDictionary } from "../utils/CustomError.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const getAllAdoptions = asyncHandler(async(req,res) => {
    logger.info('Getting all adoptions');
    const result = await adoptionsService.getAll();
    logger.info(`Retrieved ${result.length} adoptions`);
    res.send({status:"success",payload:result});
});

const getAdoption = asyncHandler(async(req,res) => {
    const adoptionId = req.params.aid;
    logger.info(`Getting adoption with ID: ${adoptionId}`);
    
    if (!adoptionId) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'ID de adopción es requerido',
            code: 400
        });
    }
    
    const adoption = await adoptionsService.getBy({_id:adoptionId});
    if(!adoption) {
        logger.warn(`Adoption not found with ID: ${adoptionId}`);
        CustomError.createError({
            name: 'NotFoundError',
            message: ErrorDictionary.ADOPTION_NOT_FOUND.message,
            code: ErrorDictionary.ADOPTION_NOT_FOUND.code
        });
    }
    
    logger.info(`Adoption found: ${adoptionId}`);
    res.send({status:"success",payload:adoption});
});

const createAdoption = asyncHandler(async(req,res) => {
    const {uid,pid} = req.params;
    logger.info(`Creating adoption - User: ${uid}, Pet: ${pid}`);
    
    if (!uid || !pid) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'User ID y Pet ID son requeridos',
            code: 400
        });
    }
    
    // Verificar usuario
    const user = await usersService.getUserById(uid);
    if(!user) {
        logger.warn(`User not found: ${uid}`);
        CustomError.createError({
            name: 'NotFoundError',
            message: ErrorDictionary.USER_NOT_FOUND.message,
            code: ErrorDictionary.USER_NOT_FOUND.code
        });
    }
    
    // Verificar mascota
    const pet = await petsService.getBy({_id:pid});
    if(!pet) {
        logger.warn(`Pet not found: ${pid}`);
        CustomError.createError({
            name: 'NotFoundError',
            message: ErrorDictionary.PET_NOT_FOUND.message,
            code: ErrorDictionary.PET_NOT_FOUND.code
        });
    }
    
    // Verificar si ya está adoptada
    if(pet.adopted) {
        logger.warn(`Pet already adopted: ${pid}`);
        CustomError.createError({
            name: 'BusinessLogicError',
            message: ErrorDictionary.PET_ALREADY_ADOPTED.message,
            code: ErrorDictionary.PET_ALREADY_ADOPTED.code
        });
    }
    
    // Realizar adopción
    user.pets.push(pet._id);
    await usersService.update(user._id,{pets:user.pets});
    await petsService.update(pet._id,{adopted:true,owner:user._id});
    const adoption = await adoptionsService.create({owner:user._id,pet:pet._id});
    
    logger.info(`Adoption created successfully - ID: ${adoption._id}`);
    res.send({status:"success",message:"Pet adopted", adoptionId: adoption._id});
});

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
};