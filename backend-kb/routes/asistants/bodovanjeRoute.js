const express = require('express');
const bodovanjeRouter = express.Router();

const bodovanjeUtils = require('../../utils/asistantUtils/bodovanjeUtils');

/**
 * @swagger
 * /api/bodovanjeprojekata/unified:
 *    post:
 *      tags:
*       - Asistenti - Bodovanje projekata
 *      description: Omogucava bodovanje projekata, tako da se definisu bodovi jednaki za svakog člana  
 */
bodovanjeRouter.post('/unified', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    bodovanjeUtils.provjeraParametaraBodovanjeProjektneGrupe(req.body, (cb) => {
        if(cb.ispravno) {
            bodovanjeUtils.upisBodovaProjektneGrupe(req.body, (err) => {
                if(err) {
                    res.send(JSON.stringify({
                        message: 'Doslo je do greske sa bazom.'
                    }));
                }
                else {
                    res.send(JSON.stringify({
                        message: 'Uspjesno bodovan projekat.'
                    }));
                }
            })
        }
        else
        {
            res.send(JSON.stringify({
                message: cb.poruka
            }));
        }
    });
});

/**
 * @swagger
 * /api/bodovanjeprojekata/specified:
 *    post:
 *      tags:
 *       - Asistenti - Bodovanje projekata
 *      description: 'Omogucava dodavanje novih osoba u već postojeće grupe za definisanje projekte.
 *      Realizvano od strane: Mašović Haris'
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
bodovanjeRouter.post('/specified', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    bodovanjeUtils.provjeraBodySpecified(req.body, (err) => {
        if(!err) {
            bodovanjeUtils.upisBodovaProjektaPoClanu(req.body.payload, (err) => {
                if(err) res.send(JSON.stringify({ message: err }));
                else res.send(JSON.stringify({ message: 'Uspjesno bodovan svaki clan grupe za definisani projekat.' }));
            }) 
        } else res.send(JSON.stringify({ message: err }));
    });
});


module.exports = bodovanjeRouter;