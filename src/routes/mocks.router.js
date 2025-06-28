import { Router } from 'express';
import { generateMockPets, generateMockUsers } from '../mocks/mocking.utils.js';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';
import logger from '../utils/logger.js';
import CustomError, { ErrorDictionary } from '../utils/CustomError.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = Router();

// GET /api/mocks/mockingpets
router.get('/mockingpets', asyncHandler((req, res) => {
  logger.info('Generating mock pets');
  const pets = generateMockPets(100);
  logger.info(`Generated ${pets.length} mock pets`);
  res.json({ status: 'success', payload: pets });
}));

// GET /api/mocks/mockingusers
router.get('/mockingusers', asyncHandler(async (req, res) => {
  logger.info('Generating mock users');
  const users = generateMockUsers(50);
  logger.info(`Generated ${users.length} mock users`);
  res.json({ status: 'success', payload: users });
}));

// POST /api/mocks/generateData?users=50&pets=100
router.post('/generateData', asyncHandler(async (req, res) => {
  const { users: usersParam, pets: petsParam } = req.query;
  
  logger.info(`Received generateData request - users: ${usersParam}, pets: ${petsParam}`);
  
  // Validación de tipos de datos
  if (usersParam && isNaN(Number(usersParam))) {
    logger.error(`Invalid users parameter: ${usersParam} - not a number`);
    CustomError.createError({
      name: 'ValidationError',
      message: `El parámetro 'users' debe ser un número válido. Recibido: ${usersParam}`,
      code: ErrorDictionary.INVALID_DATA_TYPE.code
    });
  }
  
  if (petsParam && isNaN(Number(petsParam))) {
    logger.error(`Invalid pets parameter: ${petsParam} - not a number`);
    CustomError.createError({
      name: 'ValidationError',
      message: `El parámetro 'pets' debe ser un número válido. Recibido: ${petsParam}`,
      code: ErrorDictionary.INVALID_DATA_TYPE.code
    });
  }
  
  const usersQty = Number(usersParam) || 0;
  const petsQty = Number(petsParam) || 0;
  
  // Validar que no sean números negativos
  if (usersQty < 0 || petsQty < 0) {
    logger.error(`Negative numbers not allowed - users: ${usersQty}, pets: ${petsQty}`);
    CustomError.createError({
      name: 'ValidationError',
      message: 'Los números deben ser positivos',
      code: ErrorDictionary.INVALID_DATA_TYPE.code
    });
  }
  
  // Límite razonable para evitar sobrecarga
  if (usersQty > 10000 || petsQty > 10000) {
    logger.error(`Numbers too large - users: ${usersQty}, pets: ${petsQty}`);
    CustomError.createError({
      name: 'ValidationError',
      message: 'El número máximo permitido es 10,000 por categoría',
      code: ErrorDictionary.INVALID_DATA_TYPE.code
    });
  }
  
  logger.info(`Generating ${usersQty} users and ${petsQty} pets`);
  
  const users = generateMockUsers(usersQty);
  const pets = generateMockPets(petsQty);
  
  if (users.length > 0) {
    await userModel.insertMany(users);
    logger.info(`Successfully inserted ${users.length} users to database`);
  }
  
  if (pets.length > 0) {
    await petModel.insertMany(pets);
    logger.info(`Successfully inserted ${pets.length} pets to database`);
  }
  
  logger.info(`Data generation completed successfully`);
  res.json({ 
    status: 'success', 
    message: 'Datos generados correctamente', 
    usersCreated: usersQty, 
    petsCreated: petsQty 
  });
}));

export default router;