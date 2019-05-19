const express = require('express');
const projectsRouter = express.Router();

const projectUtils = require('../../utils/asistantUtils/projectsUtils');

/**
 * @swagger
 * /services/projects/newp:
 *    post:
 *      tags:
 *       - Asistenti - Kreiranje projekata na nivou predmeta - Service
 *      description: 'Servis koji omogucava dodavanje projekata na predmetu. 
 *      Realizovano od strane: Mašović Haris'
*/
projectsRouter.post('/newp', (req, res) => {
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');

    let bool = projectUtils.provjeraParametaraPostPZ(postBody);
    if (!bool) res.send(JSON.stringify({
        message: 'Body parametri nisu specifirani [naziv_projekta, id_predmeta, id_asistenta, opis_projekta, moguci_bodovi]'
    }));
    // ukoliko je sve zadovoljeno piše se u bazu novi projekat
    else {
        let progress = postBody['progress'];
        let rokProjekta = postBody['rok_projekta'];
        if (rokProjekta) {
            let regexDatumFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])) ((0[0-9]|1[0-9]|2[0-3])\:([0-5][0-9])\:(([0-5][0-9])))/;
            if (!rokProjekta.match(regexDatumFormat)) {
                res.send(JSON.stringify({
                    message: 'Neobavezni parametar roka projekta nije u formatu [yyyy-mm-dd hh:mm:ss]!'
                }));
                return;
            }
        }
        projectUtils.upisNovogProjektaUBazu(postBody, progress, rokProjekta)
            .then((objekat) => res.send(JSON.stringify(objekat)))
            .catch(err => res.send(JSON.stringify({ message: 'Poslani [id_predmeta || id_asistenta] ne postoji u bazi ili je doslo do greske sa bazom!'})))
    }
});

/**
 * @swagger
 * /services/projects/setdeadline:
 *    post:
 *      tags:
*       - Asistenti - Kreiranje projekata na nivou predmeta - Service
 *      description: 'Omogucava postavljanje roka za projekat
 *      Realizovano od strane: Skopljak Emin'
 */
projectsRouter.post('/setdeadline', (req, res) => {
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');

    let ret = projectUtils.provjeraParametaraRokProjekta(postBody);

    if (!ret.ispravno) res.send(JSON.stringify({
        message: ret.poruka
    }));
    else {
        projectUtils.upisRokaIzradeProjekta(postBody, (err) => {
            if (err) res.send(JSON.stringify({
                message: 'Poslani id projekta ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            else res.send(JSON.stringify({
                message: 'Uspjesno dodan rok izrade projekta.'
            }));
        });
    }
});

module.exports = projectsRouter;