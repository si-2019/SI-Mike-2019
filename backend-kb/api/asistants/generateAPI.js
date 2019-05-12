const express = require('express');
const generateRouter = express.Router();

/**
 * @swagger
 * /api/generate/genOrdered:
 *    post:
 *      tags:
 *       - Asistenti - Kreiranje grupa abecednim redoslijedom - Service
 *      description: 'Omogucava kreiranje projektnih grupa abecednim redoslijedom
 *      za zadani projekat i za trenutnu akademsku godinu.
 *      Salje se kao url encoded format i prima id projekta i broj grupa, 
 *      te vraca poruku u skladu s tim da li su grupe uspjesno kreirane ili je doslo do greske.
 *      Realizovano od strane: Skopljak Emin'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: idProjekat
 *          type: integer
 *          description: ID projekta za koji kreiramo grupe.
 *        - in: formData
 *          name: brojGrupa
 *          type: integer
 *          description: Zeljeni broj grupa.
 *      required:
 *        - idProjekat
 *        - brojGrupa
 *      responses:
 *       200:
 *         description: Vraca se JSON objekat sa parametrom message
 *         content: 
 *           application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                  message:
 *                   type: string       
 */
generateRouter.post('/genOrdered', (req, res) => res.redirect(307, `/services/generate/genOrdered`));

module.exports = generateRouter;