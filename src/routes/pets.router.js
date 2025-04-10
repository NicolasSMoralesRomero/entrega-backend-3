import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Endpoints para gestión de mascotas
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 */
router.get('/', petsController.getAllPets);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crear una mascota
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetInput'
 *     responses:
 *       200:
 *         description: Mascota creada exitosamente
 *       400:
 *         description: Campos faltantes
 */
router.post('/', petsController.createPet);

/**
 * @swagger
 * /api/pets/withimage:
 *   post:
 *     summary: Crear una mascota con imagen
 *     tags: [Pets]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specie:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Mascota con imagen creada exitosamente
 */
router.post('/withimage', uploader.single('image'), petsController.createPetWithImage);

/**
 * @swagger
 * /api/pets/{pid}:
 *   put:
 *     summary: Actualizar una mascota
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetInput'
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.put('/:pid', petsController.updatePet);

/**
 * @swagger
 * /api/pets/{pid}:
 *   delete:
 *     summary: Eliminar una mascota
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada exitosamente
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/:pid', petsController.deletePet);

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "605c5f45073f3b0023b2d3e6"
 *         name:
 *           type: string
 *           example: "Firulais"
 *         specie:
 *           type: string
 *           example: "Perro"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "2022-03-15"
 *         image:
 *           type: string
 *           example: "/public/img/foto1.jpg"

 *     PetInput:
 *       type: object
 *       required:
 *         - name
 *         - specie
 *         - birthDate
 *       properties:
 *         name:
 *           type: string
 *           example: "Firulais"
 *         specie:
 *           type: string
 *           example: "Perro"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "2022-03-15"
 *         image:
 *           type: string
 *           description: Ruta de la imagen (opcional si no se sube)
 */

export default router;