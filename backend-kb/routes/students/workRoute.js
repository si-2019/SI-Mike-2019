const express = require('express');
const workRouter = express.Router();
const workUtils = require('../../utils/studentUtils/workUtils');

/**
 * @swagger
 * /services/work/:
 *    post:
 *      tags:
 *       - Studenti - Rad na projektu - Service
 *      description: 'Servis koji omogucava dodavanje projektnih zadataka za vec postojeci projekat.  
 *      Realizovano od strane: Mašović Haris'
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

// POST base/api/work/addfile
// [idProjektnogZadatka] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/work/addfile:
 *    post:
 *      tags:
*       - Studenti - Rad na projektu - Service
 *      description: Unos novog fajla u projektni zadatak
 */
workRouter.post('/addfile',(req,res)=>{

});

/**
 * @swagger
 * /services/work/assigntask:
 *    post:
 *      tags:
*       - Studenti - Rad na projektu - Service
 *      description: Dodjela projektnog zadatka clanu grupe, od strane vođe grupe.
 */
workRouter.post('/assigntask', (req, res) => {
    res.send('masha');
});

// POST base/api/work/deletefile
// [idFajla] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/work/deletefile:
 *    post:
 *      tags:
*       - Studenti - Rad na projektu - Service
 *      description: Brisanje fajla iz projektnog zadatka
 */
workRouter.post('/deletefile',(req,res)=>{

});

module.exports = workRouter;