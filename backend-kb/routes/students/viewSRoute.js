const express = require('express');
const viewSRouter = express.Router();

const viewSUtils = require('../../utils/studentUtils/viewSUtils');

// POST base/api/viewS/projects
// [idUser] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewS/projects:
 *    post:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Dohvatanje svih projekata studenta
 */
viewSRouter.post('/projects',(req,res)=>{

});

// POST base/api/viewS/tasks
// [idProjekat] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewS/tasks:
 *    post:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Dohvatanje svih zadataka na projektu
 */
viewSRouter.post('/tasks',(req,res)=>{

});


/**
 * @swagger
 * /services/viewS/customdata/id:
 *    get:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Custom servis za dohvatanje podataka po mjeri / obavezno slati idPredmet!
 */
viewSRouter.get('/customdata/:id', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    let finalanNiz = [];
    if (!req.params.id) res.send(JSON.stringify({ message: 'ID nije poslan u url.' }));
    else {
        viewSUtils.dajSveProjekte(req.params.id, (err, projekti) => {
            if (err) res.send(JSON.stringify({
                message: 'Greška u bazi'
            }));
            else {
                for (let i = 0; i < projekti.length; ++i) finalanNiz.push({
                    id: projekti[i].idProjekat,
                    opis_projekta: projekti[i].opisProjekta
                });
                viewSUtils.zaSvakiPredmetPopuniProjektneZadatke(finalanNiz, (err2, rez) => {
                    if (err2) res.send(JSON.stringify({
                        message: 'Greška u bazi'
                    }));
                    else res.send(JSON.stringify({projekti: rez}));
                })
            }
        });
    }
});

/**
 * @swagger
 * /services/viewS/user-projects/id:
 *    get:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Custom servis za dobijanje projekata zavisno od id usera
 */
viewSRouter.get('/user-projects/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let finalanNiz = [];
    if (!req.params.id) res.send(JSON.stringify({ message: 'ID nije poslan u url.' }));
    else {
        viewSUtils.dajSveProjekte(req.body['idPredmet'], (err, projekti) => {
            if (err) res.send(JSON.stringify({
                message: 'Greška u bazi'
            }));
            else {
                for (let i = 0; i < projekti.length; ++i) finalanNiz.push({
                    id: projekti[i].idProjekat,
                    opis_projekta: projekti[i].opisProjekta
                });
                viewSUtils.zaSvakiPredmetPopuniProjektneZadatke(finalanNiz, (err2, rez) => {
                    if (err2) res.send(JSON.stringify({
                        message: 'Greška u bazi'
                    }));
                    else res.send(JSON.stringify({projekti: rez}));
                })
            }
        });
    }
});


/**
 * @swagger
 * /services/viewS/predmeti:
 *    get:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Custom servis za dohvacanje svih predmeta.
 */
viewSRouter.get('/predmeti', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    viewSUtils.dajSvePredmete((err, predmeti) => {
        if (err) res.send(JSON.stringify({ message: 'Greška u bazi' }));
        else res.send(JSON.stringify(predmeti));
    });
});

module.exports = viewSRouter;