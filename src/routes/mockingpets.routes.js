import { Router } from 'express';
import { generateMockPets } from '../mocks/pets.mock.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const pets = generateMockPets(100);
        res.json({ status: 'success', payload: pets });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
