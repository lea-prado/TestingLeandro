
import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios del sistema de adopción
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Recupera una lista completa de todos los usuarios registrados en el sistema
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     payload:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 summary: Respuesta exitosa con usuarios
 *                 value:
 *                   status: "success"
 *                   payload: [
 *                     {
 *                       "_id": "64a7b8c9d1234567890abcdef",
 *                       "first_name": "Juan",
 *                       "last_name": "Pérez",
 *                       "email": "juan.perez@email.com",
 *                       "role": "user",
 *                       "pets": ["64a7b8c9d1234567890abcd01"],
 *                       "createdAt": "2023-07-07T10:30:00.000Z",
 *                       "updatedAt": "2023-07-07T10:30:00.000Z"
 *                     }
 *                   ]
 *               empty:
 *                 summary: No hay usuarios registrados
 *                 value:
 *                   status: "success"
 *                   payload: []
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Obtener usuario específico
 *     description: Recupera la información detallada de un usuario específico mediante su ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     payload:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               status: "success"
 *               payload:
 *                 _id: "64a7b8c9d1234567890abcdef"
 *                 first_name: "Juan"
 *                 last_name: "Pérez"
 *                 email: "juan.perez@email.com"
 *                 role: "user"
 *                 pets: ["64a7b8c9d1234567890abcd01", "64a7b8c9d1234567890abcd02"]
 *                 createdAt: "2023-07-07T10:30:00.000Z"
 *                 updatedAt: "2023-07-07T10:30:00.000Z"
 *       400:
 *         $ref: '#/components/responses/400'
 *       404:
 *         $ref: '#/components/responses/404'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get('/:uid', usersController.getUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Actualizar usuario
 *     description: |
 *       Actualiza la información de un usuario existente. 
 *       
 *       **Restricciones importantes:**
 *       - No se puede actualizar la contraseña mediante este endpoint
 *       - Si se cambia el email, debe ser único en el sistema
 *       - Todos los campos son opcionales en la actualización
 *       
 *       **Campos que se pueden actualizar:**
 *       - Nombre y apellido
 *       - Email (si no está en uso)
 *       - Rol del usuario
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *     requestBody:
 *       required: true
 *       description: Datos del usuario a actualizar (todos los campos son opcionales)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           examples:
 *             updateName:
 *               summary: Actualizar nombre y apellido
 *               value:
 *                 first_name: "Juan Carlos"
 *                 last_name: "Pérez García"
 *             updateEmail:
 *               summary: Cambiar email
 *               value:
 *                 email: "nuevo.email@ejemplo.com"
 *             updateRole:
 *               summary: Cambiar rol a administrador
 *               value:
 *                 role: "admin"
 *             fullUpdate:
 *               summary: Actualización completa
 *               value:
 *                 first_name: "Juan Carlos"
 *                 last_name: "Pérez García"
 *                 email: "juan.carlos@ejemplo.com"
 *                 role: "admin"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateResponse'
 *             example:
 *               status: "success"
 *               message: "User updated"
 *               userId: "64a7b8c9d1234567890abcdef"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingId:
 *                 summary: ID de usuario faltante
 *                 value:
 *                   status: "error"
 *                   error: "ID de usuario es requerido"
 *                   code: 400
 *               emptyBody:
 *                 summary: Datos de actualización vacíos
 *                 value:
 *                   status: "error"
 *                   error: "Datos de actualización son requeridos"
 *                   code: 400
 *               passwordUpdate:
 *                 summary: Intento de actualizar contraseña
 *                 value:
 *                   status: "error"
 *                   error: "Para cambiar la contraseña use el endpoint específico"
 *                   code: 400
 *       404:
 *         $ref: '#/components/responses/404'
 *       409:
 *         description: Conflicto - Email ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "error"
 *               error: "El email ya está en uso"
 *               code: 409
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.put('/:uid', usersController.updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: |
 *       Elimina un usuario del sistema de forma permanente.
 *       
 *       **⚠️ Advertencia:** Esta acción es irreversible.
 *       
 *       **Consideraciones:**
 *       - Se verificará si el usuario tiene adopciones activas
 *       - Se manejará la relación con las mascotas adoptadas
 *       - Se mantendrá la integridad referencial de la base de datos
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *             example:
 *               status: "success"
 *               message: "User deleted"
 *               userId: "64a7b8c9d1234567890abcdef"
 *       400:
 *         description: ID de usuario requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "error"
 *               error: "ID de usuario es requerido"
 *               code: 400
 *       404:
 *         $ref: '#/components/responses/404'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.delete('/:uid', usersController.deleteUser);

export default router;