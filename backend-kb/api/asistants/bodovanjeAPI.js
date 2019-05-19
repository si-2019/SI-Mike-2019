const express = require('express');
const bodovanjeRouter = express.Router();

/**
 * @swagger
 * /api/bodovanjeprojekata/unified:
 *    post:
 *      tags:
 *       - Asistenti - Bodovanje projekata - API
 *      description: 'Omogucava bodovanje projekata, tako da se definisu bodovi jednaki za svakog clana.
 *      Salje se kao url encoded format i prima id projektne grupe i broj bodova, 
 *      te vraca poruku u skladu s tim da li su bodovi uspjesno postavljeni ili je doslo do greske.
 *      Realizovano od strane: Skopljak Emin'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: idGrupaProjekta
 *          type: integer
 *          description: ID projektne grupe ciji clanovi se boduju.
 *        - in: formData
 *          name: bodovi
 *          type: integer
 *          description: Broj bodova koji su ostvarili clanovi grupe.
 *      required:
 *        - idGrupaProjekta
 *        - bodovi
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
bodovanjeRouter.post('/unified', (req, res) => res.redirect(307, `/services/bodovanjeprojekata/unified`));

/**
 * @swagger
 * /api/bodovanjeprojekata/specified:
 *    post:
 *      tags:
 *       - Asistenti - Bodovanje projekata - API
 *      description: 'Omogucava dodavanje novih osoba u već postojeće grupe za definisanje projekte.
 *      Realizovano od strane: Mašović Haris'
 *      consumes:
 *       - application/json
 *      parameters:
 *          - in: body
 *            name: payload
 *            description: The user to create.
 *            schema:
 *             type: object
 *             properties:
 *              projekat:
 *               type: integer
 *              payload: 
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                  idStudent:
 *                   type: integer
 *                  idGrupaProjekta:
 *                   type: integer
 *                  ostvareniBodovi:
 *                   type: number
 *                required:
 *                - idStudent
 *                - idGrupaProjekta
 *                - ostvareniBodovi
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
bodovanjeRouter.post('/specified', (req, res) => res.redirect(307, '/services/bodovanjeprojekata/specified'));


module.exports = bodovanjeRouter;