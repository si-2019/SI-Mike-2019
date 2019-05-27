const express = require('express');
const bodovanjeRouter = express.Router();

const bodovanjeUtils = require('../../utils/asistantUtils/bodovanjeUtils');

/**
 * @swagger
 * /services/bodovanjeprojekata/unified:
 *    post:
 *      tags:
*       - Asistenti - Bodovanje projekata - Service
 *      description: 'Omogucava bodovanje projekata, tako da se definisu bodovi jednaki za svakog clana  
 *      Realizovano od strane: Skopljak Emin'
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
 * /services/bodovanjeprojekata/specified:
 *    post:
 *      tags:
 *       - Asistenti - Bodovanje projekata - Service
 *      description: 'Servis koji omogucava bodovanje projekata za svakog clana pojedinacno.
 *      Realizovano od strane: Mašović Haris'
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

/**
 * @swagger
 * /services/bodovanjeprojekata/tasks:
 *    post:
 *      tags:
 *       - Asistenti - Bodovanje projekata - Service
 *      description: 'Servis koji omogucava bodovanje projektnih zadataka pojedinacno.
 *      Realizovano od strane: Mašović Haris'
 */
bodovanjeRouter.post('/tasks', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if(!bodovanjeUtils.provjeraSvakogProjektnog(req.body)) res.send(JSON.stringify({ message: 'Format podataka nije pravilo definisan.' }));
    else bodovanjeUtils.bodovanjeProjektnogZadatka(req.body, (err) => {
            if(err) res.send(JSON.stringify({ message: err }));
            else res.send(JSON.stringify({ message: 'Uspješno bodovan svaki projektni zadatak!' }));
        }); 
});


module.exports = bodovanjeRouter;