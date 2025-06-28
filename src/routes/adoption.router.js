import { Router } from 'express';
import Adoption from '../dao/Adoption.js';
import User from '../dao/Users.dao.js';

import Pet from '../dao/Pets.dao.js';

const router = Router();
const adoptionService = new Adoption();
const userService = new User();
const petService = new Pet();

// GET /api/adoptions - Obtener todas las adopciones
router.get('/', async (req, res) => {
    try {
        const result = await adoptionService.getAll();
        res.status(200).json({
            status: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error getting adoptions:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/adoptions/:aid - Obtener adopción por ID
router.get('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;
        
        if (!aid) {
            return res.status(400).json({
                status: 'error',
                error: 'ID de adopción requerido'
            });
        }

        const adoption = await adoptionService.getBy({ _id: aid });
        
        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                error: 'Adopción no encontrada'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: adoption
        });
    } catch (error) {
        console.error('Error getting adoption by ID:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor'
        });
    }
});

// POST /api/adoptions/:uid/:pid - Crear nueva adopción
router.post('/:uid/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params;

        // Validar que se proporcionen ambos IDs
        if (!uid || !pid) {
            return res.status(400).json({
                status: 'error',
                error: 'User ID y Pet ID son requeridos'
            });
        }

        // Verificar que el usuario existe
        const user = await userService.getBy({ _id: uid });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                error: 'Usuario no encontrado'
            });
        }

        // Verificar que la mascota existe
        const pet = await petService.getBy({ _id: pid });
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                error: 'Mascota no encontrada'
            });
        }

        // Verificar que la mascota no esté ya adoptada
        if (pet.adopted) {
            return res.status(400).json({
                status: 'error',
                error: 'La mascota ya está adoptada'
            });
        }

        // Crear la adopción
        const adoptionData = {
            owner: uid,
            pet: pid,
            date: new Date()
        };

        const adoption = await adoptionService.save(adoptionData);

        // Actualizar la mascota como adoptada
        await petService.update(pid, { 
            adopted: true, 
            owner: uid 
        });

        // Agregar la mascota a la lista de mascotas del usuario
        if (!user.pets) {
            user.pets = [];
        }
        user.pets.push(pid);
        await userService.update(uid, { pets: user.pets });

        res.status(200).json({
            status: 'success',
            message: 'Pet adopted',
            adoptionId: adoption._id
        });

    } catch (error) {
        console.error('Error creating adoption:', error);
        
        // Manejar errores específicos de MongoDB
        if (error.name === 'CastError') {
            return res.status(400).json({
                status: 'error',
                error: 'ID inválido proporcionado'
            });
        }

        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor'
        });
    }
});

// Exportación por defecto
export default router;