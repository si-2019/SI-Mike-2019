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
 * /services/viewS/user-projects/:id:
 *    get:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Custom servis za dobijanje svih projekata zajedno sa pripadajucim zadacima za datog korisnika
 */
viewSRouter.get('/user-projects/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.params.id) res.send(JSON.stringify({ message: 'ID nije poslan u url.' }));
    else {
        viewSUtils.dajSveProjekteUsera(req.params.id).then((projekti) => {
            if(!projekti) {
                res.send(JSON.stringify({ message: 'Doslo je do greske.' }));
            }
            else {
                //za svaki projekat fetchati sve projektne zadatke
                let finalanNiz = [];
                let brojObradjenih = 0;
                let greska = false;

                for(let i = 0; i < projekti.length; i++) {
                    new function() {
                        var i_closure = i;

                        viewSUtils.dajSveZadatkeProjekta(projekti[i].idProjekat).then((zadaci) => {
                            if(!zadaci) {
                                if(!greska) res.send(JSON.stringify({ message: 'Doslo je do greske.' }));
                                greska = true;
                            }

                            finalanNiz[i_closure] = {
                                id: projekti[i_closure].idProjekat,
                                naziv_projekta: projekti[i_closure].nazivProjekta,
                                naziv_predmeta: projekti[i_closure].naziv,
                                opis_projekta: projekti[i_closure].opis,
                                zadaci: zadaci
                            }
                            brojObradjenih++;
                            if(brojObradjenih == projekti.length) {
                                if(!greska) res.send(JSON.stringify({projekti: finalanNiz}));
                            }
                        });
                    }();
                }
            }
        })
        .catch(err => res.send(JSON.stringify({ message: 'Doslo je do greske catch blok.' })));;
    }
});

//
/**
 * @swagger
 * /services/viewS/predmeti-za-generisanje-grupa/:id:
 *    get:
 *      tags:
 *       - Studenti - Pregled projekata - Service
 *      description: 'Custom servis za dobijanje svih predmeta na kojima je student, sa pripadajucim projektima,
 *      na kojima student nije niti u jednoj grupi tako da moze generisati novu grupu za taj projekat'
 */
viewSRouter.get('/predmeti-za-generisanje-grupa/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.params.id) res.send(JSON.stringify({ message: 'ID nije poslan u url.' }));
    else {
        viewSUtils.dajSvePredmete()
        .then((predmeti) => {
            if(!predmeti) {
                res.send(JSON.stringify({ message: 'Doslo je do greske.' }));
            }
            else {
                let finalanNiz = [];
                let brojObradjenih = 0;
                let greska = false;

                for(let i = 0; i < predmeti.length; i++) {
                    new function() {
                        var i_closure = i;

                        viewSUtils.dajProjekteKreiranjeGrupe(req.params.id, predmeti[i_closure].id).then((projekti) => {
                            if(!projekti) {
                                if(!greska) res.send(JSON.stringify({ message: 'Doslo je do greske.' }));
                                greska = true;
                            }
    
                            finalanNiz[i_closure] = {
                                id: predmeti[i_closure].id,
                                naziv_predmeta: predmeti[i_closure].naziv,
                                projekti: projekti
                            }

                            brojObradjenih++;
                            if(brojObradjenih == predmeti.length) {
                                if(!greska) {
                                    res.send(JSON.stringify({predmeti: finalanNiz.filter(predmet => predmet.projekti.length > 0)}));
                                }
                            }
                        });
                    }();
                }
            }
        })
        .catch(err => res.send(JSON.stringify({ message: 'Doslo je do greske catch blok.' })));
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

/**
 * @swagger
 * /services/viewS/download-projects-json:
 *    get:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Custom servis za download svih projekata i projektnih zadataka u vidu json fajla.
 */
viewSRouter.get('/download-projects-json', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    viewSUtils.dajSveProjekteProjektneZadatke((err, podaci) => {
        if (err) res.send(JSON.stringify({ message : 'Greska prilikom downloadovanja.'}));
        else {
            res.setHeader('Content-Disposition', 'attachment; filename=projekti.json');
            res.send(JSON.stringify(podaci)); 
        }
    });
});


module.exports = viewSRouter;