import { Router } from 'express';
import { generateMockPets, generateMockUsers } from '../mocks/mocking.utils.js';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';

const router = Router();

// GET /api/mocks/mockingpets
router.get('/mockingpets', (req, res) => {
  const pets = generateMockPets(100);
  res.json({ status: 'success', payload: pets });
});

// GET /api/mocks/mockingusers
router.get('/mockingusers', async (req, res) => {
  const users = generateMockUsers(50);
  res.json({ status: 'success', payload: users });
});

// POST /api/mocks/generateData?users=50&pets=100
router.post('/generateData', async (req, res) => {
  try {
    const usersQty = parseInt(req.query.users) || 0;
    const petsQty = parseInt(req.query.pets) || 0;

    const users = generateMockUsers(usersQty);
    const pets = generateMockPets(petsQty);

    await userModel.insertMany(users);
    await petModel.insertMany(pets);

    res.json({ status: 'success', message: 'Datos generados correctamente', usersQty, petsQty });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;
