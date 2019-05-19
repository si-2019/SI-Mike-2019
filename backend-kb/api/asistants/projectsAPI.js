const express = require('express');
const projectsRouter = express.Router();

/**
 * @swagger
 * /api/projects/newp:
 *    post:
 *      tags:
 *       - Asistenti - Kreiranje projekata na nivou predmeta - API
 *      description: 'Omogucava dodavanje projektnih zadataka za vec postojeci projekat. 
 *      Salje se kao url encoded format i prima i kao rezultat vraca json projekta ukoliko je uspješno dodan projekat,
 *      a ako nije json sa parametrom message koji govori da nije uspješno dodan projekat.
 *      Realizovano od strane: Mašović Haris'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: naziv_projekta
 *          type: string
 *          description: naziv projekta.
 *        - in: formData
 *          name: id_predmeta
 *          type: integer
 *          description: ID predmeta npr ~ [4].
 *        - in: formData
 *          name: id_asistenta
 *          type: integer
 *          description: ID nekog asistenta ~ [2]
 *        - in: formData
 *          name: opis_projekta
 *          type: string
 *          description: opis projekta, sta se radi.
 *        - in: formData
 *          name: moguci_bodovi
 *          type: number
 *          description: moguci ostvarivi bodovi na projektu.
 *        - in: formData
 *          name: progress
 *          type: number
 *          description: progress projekta.
 *        - in: formData
 *          name: rok_projekta
 *          type: string
 *          description: rok projekta završetak.
 *      required:
 *        - id_predmeta
 *        - id_asistenta
 *        - opis_projekta
 *        - moguci_bodovi
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
projectsRouter.post('/newp', (req, res) => res.redirect(307, '/services/projects/newp'));

/**
 * @swagger
 * /api/projects/setdeadline:
 *    post:
 *      tags:
 *       - Asistenti - Kreiranje projekata na nivou predmeta - API
 *      description: 'Omogucava postavljanje roka za projekat.
 *      Salje se kao url encoded format i prima id projekta i rok izrade, 
 *      te vraca poruku u skladu s tim da li je rok uspjesno postavljen ili je doslo do greske.
 *      Realizovano od strane: Skopljak Emin'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: idProjekat
 *          type: integer
 *          description: ID projekta za koji se postavlja rok.
 *        - in: formData
 *          name: rokProjekta
 *          type: string
 *          description: Rok projekta.
 *      required:
 *        - idProjekat
 *        - rokProjekta
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
projectsRouter.post('/setdeadline', (req, res) => res.redirect(307, '/services/projects/setdeadline'));

module.exports = projectsRouter;