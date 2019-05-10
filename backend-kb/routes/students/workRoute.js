const express = require('express');
const workRouter = express.Router();
const workUtils = require('../../utils/studentUtils/workUtils');

/**
 * @swagger
 * /api/work/:
 *    post:
 *      tags:
 *       - Studenti - Rad na projektu
 *      description: 'Omogucava dodavanje projektnih zadataka za vec postojeci projekat. 
 *      Salje se kao url encoded format i prima i kao rezultat vraca json projektnog zadatka ukoliko je uspješno dodana 
 *      ako nije json sa parametrom message koji govori da nije uspješno dodan projektni zadatak za projekat. 
 *      Realizvano od strane: Mašović Haris'
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
 *          description: opis projektnog zadatka.
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
workRouter.post('/', (req, res) => {    
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');
    
    let bool = workUtils.provjeraParametaraPostPZ(postBody); 
    if (!bool) res.send(JSON.stringify({ message: 'Body parametri nisu specifirani [id_projekta, od_kad, do_kad]' }));
    else {
        let opis = "";
        let zavrsen = false;
        let komentar_a = "";
        if(postBody['opis']) opis = postBody['opis'];
        if(postBody['zavrsen']) zavrsen = postBody['zavrsen'];
        if(postBody['komentar_asistenta']) komentar_a = postBody['komentar_asistenta'];

        // provjera regex od kad i do kad parametara
        let regexDatumFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])) ((0[0-9]|1[0-9]|2[0-3])\:([0-5][0-9])\:(([0-5][0-9])))/;
        if(!postBody['od_kad'].match(regexDatumFormat) || !postBody['do_kad'].match(regexDatumFormat)){
            res.send(JSON.stringify({ message: 'Datumi nisu u formatu [yyyy-mm-dd hh:mm:ss]!' }));
            return;
        }

        // ukoliko je sve zadovoljeno piše se u bazu
        workUtils.upisNovogPZuBazu(postBody, opis, zavrsen, komentar_a, (err, objekat) => {
            if(err) res.send(JSON.stringify({ message: 'Poslani [id_projekta] ne postoji u bazi ili je doslo do greske sa bazom!' }));
            else res.send(JSON.stringify(objekat));
        });
        
    }
});

module.exports = workRouter;