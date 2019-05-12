const express = require('express');
const workRouter = express.Router();

/**
 * @swagger
 * /api/work/:
 *    post:
 *      tags:
 *       - Studenti - Rad na projektu - API
 *      description: 'Omogucava dodavanje projektnih zadataka za vec postojeci projekat. 
 *      Salje se kao url encoded format i prima i kao rezultat vraca json projektnog zadatka ukoliko je uspješno dodana 
 *      ako nije json sa parametrom message koji govori da nije uspješno dodan projektni zadatak za projekat. 
 *      Realizovano od strane: Mašović Haris'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: id_projekta
 *          type: number
 *          description: ID projekta npr ~ [29].
 *        - in: formData
 *          name: od_kad
 *          type: string
 *          description: datum od kada npr ~ [2019-11-03 23:00:00].
 *        - in: formData
 *          name: do_kad
 *          type: string
 *          description: datum do kada npr ~ [2019-11-03 23:00:00].
 *        - in: formData
 *          name: opis
 *          type: string
 *          description: opis projektnog zadatka.
 *        - in: formData
 *          name: zavrsen
 *          type: boolean
 *          description: zavrsen projektni zadatak?.
 *        - in: formData
 *          name: komentar_asistenta
 *          type: string
 *          description: komentar asistenta.
 *      required:
 *        - id_projekta
 *        - od_kad
 *        - do_kad
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
workRouter.post('/', (req, res) => res.redirect(307, '/services/work/')); 

module.exports = workRouter;