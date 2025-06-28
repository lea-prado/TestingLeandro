import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import logger from "../utils/logger.js";
import CustomError, { ErrorDictionary } from "../utils/CustomError.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const getAllPets = asyncHandler(async(req,res) => {
    logger.info('Getting all pets');
    const pets = await petsService.getAll();
    logger.info(`Retrieved ${pets.length} pets`);
    res.send({status:"success",payload:pets});
});

const createPet = asyncHandler(async(req,res) => {
    const {name,specie,birthDate} = req.body;
    logger.info(`Creating pet: ${name}`);
    
    if(!name||!specie||!birthDate) {
        logger.warn('Incomplete pet data provided');
        CustomError.createError({
            name: 'ValidationError',
            message: 'Nombre, especie y fecha de nacimiento son requeridos',
            code: 400
        });
    }
    
    const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
    const result = await petsService.create(pet);
    logger.info(`Pet created successfully with ID: ${result._id}`);
    res.send({status:"success",payload:result});
});

const updatePet = asyncHandler(async(req,res) => {
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    logger.info(`Updating pet: ${petId}`);
    
    if (!petId) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'ID de mascota es requerido',
            code: 400
        });
    }
    
    // Verificar que la mascota existe
    const existingPet = await petsService.getBy({_id: petId});
    if (!existingPet) {
        logger.warn(`Pet not found for update: ${petId}`);
        CustomError.createError({
            name: 'NotFoundError',
            message: ErrorDictionary.PET_NOT_FOUND.message,
            code: ErrorDictionary.PET_NOT_FOUND.code
        });
    }
    
    const result = await petsService.update(petId,petUpdateBody);
    logger.info(`Pet updated successfully: ${petId}`);
    res.send({status:"success",message:"pet updated", petId});
});

const deletePet = asyncHandler(async(req,res) => {
    const petId = req.params.pid;
    logger.info(`Deleting pet: ${petId}`);
    
    if (!petId) {
        CustomError.createError({
            name: 'ValidationError',
            message: 'ID de mascota es requerido',
            code: 400
        });
    }
    
    // Verificar que la mascota existe
    const existingPet = await petsService.getBy({_id: petId});
    if (!existingPet) {
        logger.warn(`Pet not found for deletion: ${petId}`);
        CustomError.createError({
            name: 'NotFoundError',
            message: ErrorDictionary.PET_NOT_FOUND.message,
            code: ErrorDictionary.PET_NOT_FOUND.code
        });
    }
    
    const result = await petsService.delete(petId);
    logger.info(`Pet deleted successfully: ${petId}`);
    res.send({status:"success",message:"pet deleted", petId});
});

const createPetWithImage = asyncHandler(async(req,res) => {
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    logger.info(`Creating pet with image: ${name}`);
    
    if(!name||!specie||!birthDate) {
        logger.warn('Incomplete pet data provided for image upload');
        CustomError.createError({
            name: 'ValidationError',
            message: 'Nombre, especie y fecha de nacimiento son requeridos',
            code: 400
        });
    }
    
    if (!file) {
        logger.warn('No image file provided');
        CustomError.createError({
            name: 'ValidationError',
            message: 'Imagen es requerida',
            code: 400
        });
    }
    
    logger.debug(`Image file details:`, {
        filename: file.filename,
        originalname: file.originalname,
        size: file.size
    });
    
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });
    
    const result = await petsService.create(pet);
    logger.info(`Pet with image created successfully with ID: ${result._id}`);
    res.send({status:"success",payload:result});
});

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
};