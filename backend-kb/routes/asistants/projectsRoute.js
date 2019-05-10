const express = require('express');
const projectsRouter = express.Router();

const projectUtils = require('../../utils/asistantUtils/projectsUtils');

/**
 * @swagger
 * /api/projects/newp:
 *    post:
 *      tags:
 *       - Studenti - Rad na projektu
 *      description: 'Omogucava dodavanje projektnih zadataka za vec postojeci projekat. 
 *      Salje se kao url encoded format i prima i kao rezultat vraca json projektnog zadatka ukoliko je uspješno dodan projekat,
 *      a ako nije json sa parametrom message koji govori da nije uspješno dodan projekat.
 *      Realizvano od strane: Mašović Haris'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: id_predmeta
 *          type: integer
 *          description: ID projekta npr ~ [3].
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
 * /api/projects/setdeadline:
 *    post:
 *      tags:
*       - Asistenti - Kreiranje projekata na nivou predmeta
 *      description: Omogucava postavljanje roka za projekat
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