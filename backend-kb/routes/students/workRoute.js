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

/**
 * @swagger
 * /services/work/assigntask:
 *    post:
 *      tags:
*       - Studenti - Rad na projektu - Service
 *      description: 'Dodjela projektnog zadatka clanu grupe, od strane vođe grupe. Realizovano od strane: Mašović Haris.'
 */
workRouter.post('/assigntask', (req, res) => {
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');
    
    let bool = workUtils.provjeraParametaraAssignTask(postBody);
    if (!bool) res.send(JSON.stringify({ message: 'Body parametri nisu specifirani: idVodje, zadaci: [{idClangGrupe, idProjektniZadatak}..].' }));
    else workUtils.provjeraVodjeIClanova(postBody, (err) => {
        if(err) res.send(JSON.stringify({ message: err }));
        // ukoliko je sve zadovoljeno, onda se prelazi na postavljanje projektnih zadataka određenim članovima
        else workUtils.odradiPostavljanjeZadataka(postBody.zadaci, (err2) => {
            if(err) res.send(JSON.stringify({ message: err2 }))
            else res.send(JSON.stringify({ message: 'Uspiješno dodijeljeni zadaci svim članovima.' }));
        })
    }); 
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
workRouter.post('/addfile', (req, res) => { 
    res.setHeader('Content-Type', 'application/json');
    workUtils.provjeraParametaraUploadFajla(req.body, (cb) => {
        if(cb.ispravno) {
            if(req.body.fajlovi) {
                //submitanje forme - finaliziranje
                console.log("Submitanje forme - finaliziranje");
                console.log(req.body);
                console.log(req.body.fajlovi);
                        
                //workUtils.spremiFajl(req.body.fajlovi, req.body['idProjektnogZadatka']);
            }
        }
        else {
            console.log("Neispravno");
            res.send(JSON.stringify({
                message: cb.poruka
            }));
        }
    }); 
});

// POST base/api/work/addfileupload
/**
 * @swagger
 * /services/work/addfile:
 *    post:
 *      tags:
*       - Studenti - Rad na projektu - Service
 *      description: Upload fajla
 */ 
workRouter.post('/addfileupload', workUtils.upload.array('fajlovi'), (req, res) => {
    if(req.files && req.files.length > 0) {
        //upload fajla
        console.log("File upload pozvan");
        console.log(req.files);

        let puno_ime = req.files[0].filename;
        let ime = puno_ime.substring(0, puno_ime.length - 9);
        let id = puno_ime.substring(puno_ime.length - 9, puno_ime.length);

        console.log(`ime: ${ime}  id: ${id}`);

        res.setHeader('Content-Type', 'text/plain');
        res.send(id);
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'Doslo je do greske'
        }));
    }
});

workRouter.delete('/addfileupload', (req, res) => { 
    console.log("DELETE pozvan");
    //workUtils.obrisiTempFajl(req.body);
    console.log(req.body);
    res.end();
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