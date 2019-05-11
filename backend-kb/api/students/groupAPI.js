const express = require('express');
const groupRouter = express.Router();

/**
 * @swagger
 * /api/group/:
 *    post:
 *      tags:
*       - Studenti - Kreiranje projektne grupe - API
 *      description: Omogucava kreiranje novih projektnih grupa
 */
groupRouter.post('/', (req, res) => res.redirect(307, '/services/group/'));

/**
 * @swagger
 * /api/group/addmembers:
 *    post:
 *      tags:
 *       - Studenti - Kreiranje projektne grupe - API
 *      description: 'Omogucava dodavanje novih osoba u već postojeće grupe za definisanje projekte.
 *      Realizvano od strane: Mašović Haris'
 *      consumes:
 *       - application/json
 *      parameters:
 *          - in: body
 *            name: payload
 *            description: The user to create.
 *            schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                  idStudent:
 *                   type: integer
 *                  idGrupaProjekta:
 *                   type: integer
 *                  kreator:
 *                   type: boolean
 *               required:
 *               - idStudent
 *               - idGrupaProjekta
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
groupRouter.post('/addmembers', (req, res) => res.redirect(307, '/services/group/addmembers'));

/**
 * @swagger
 * /api/group/selectleader:
 *    post:
 *      tags:
*       - Studenti - Kreiranje projektne grupe - API
 *      description: Izbor vođe generisane grupe
 */
groupRouter.post('/selectleader', (req, res) => res.redirect(307, '/services/group/selectleader'));

module.exports = groupRouter;