const express = require('express');
const generateRouter = express.Router();

const generateUtils = require('../../utils/asistantUtils/generateUtils');

/**
 * @swagger
 * /services/generate/genOrdered:
 *    post:
 *      tags:
 *       - Asistenti - Generisanje projektnih grupa - Service
 *      description: 'Omogucava kreiranje projektnih grupa abecednim redoslijedom
 *      za zadani projekat i za trenutnu akademsku godinu.
 *      Realizovano od strane: Skopljak Emin'
 */
generateRouter.post('/genOrdered', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    generateUtils.provjeraParametaraGenerisanjeGrupe(req.body, (cb) => {
        if(cb.ispravno) {
            generateUtils.upisGrupaNasumicno(req.body, (err) => {
                if(err) {
                    res.send(JSON.stringify({
                        message: 'Doslo je do greske.'
                    }));
                }
                else {
                    res.send(JSON.stringify({
                        message: 'Uspjesno kreirane projektne grupe.'
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

// POST base/services/generate/generategroups
// [idProjekat] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewA/generategroups:
 *    post:
 *      tags:
*       - Asistenti - Generisanje projektnih grupa - Service
 *      description: Generisanje projektnih grupa na projektu
 */
generateRouter.post('/generategroups',(req,res)=>{


});

module.exports = generateRouter;