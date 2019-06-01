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

/**
 * @swagger
 * /services/work/addfile:
 *    post:
 *      tags:
*       - Studenti - Rad na projektu - Service
 *      description: 'Unos novog fajla u projektni zadatak. Realizovano od strane: Skopljak Emin.'
 */ 
workRouter.post('/addfile', workUtils.upload.array('fajlovi'), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    workUtils.provjeraParametaraUploadFajla(req.body, (cb) => {
        if(cb.ispravno) {
            if(req.files) {
                let idProjektnogZadatka = req.body.idProjektnogZadatka;

                let promisi = []
                for(let i = 0; i < req.files.length; i++) {
                    promisi.push(
                        workUtils.spremiFajlUBazu(req.files[i], idProjektnogZadatka)
                    );
                }

                Promise.all(promisi).then((values) => {
                    let ispravno = true;
                    for(let i = 0; i < values.length; i++) {
                        if(values[i] == null) {
                            ispravno = false;
                            break;
                        }
                    }

                    if(ispravno) {
                        res.send(JSON.stringify({
                            message: 'Uspjesno dodani fajlovi u projektni zadatak.'
                        }));
                    }
                    else {
                        res.send(JSON.stringify({
                            message: "Doslo je do greske. Fajlovi ne smiju biti veci od 64KB."
                        }));
                    }
                }).catch(() => {
                    res.send(JSON.stringify({
                        message: "Doslo je do greske."
                    }));
                });
            }
            else {
                res.send(JSON.stringify({
                    message: "Doslo je do greske."
                }));
            }
        }
        else {
            res.send(JSON.stringify({
                message: cb.poruka
            }));
        }
    }); 
});

/**
 * @swagger
 * /services/work/downloadProjektniFajl:
 *    get:
 *      tags:
*       - Studenti - Rad na projektu - Service
 *      description: 'Download fajla projektnog zadatka. Realizovano od strane: Skopljak Emin.'
 */ 
workRouter.get('/downloadProjektniFajl', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let idFajla = req.body.idProjektnogFajla;
    //let idFajla = req.query.idProjektnogFajla; //za testiranje u browseru

    if(!idFajla) {
        res.send(JSON.stringify({message: 'Body parametri nisu specifirani: idProjektnogFajla.'}));
    }
    else {
        workUtils.dajFajlIzBaze(idFajla).then((fajl) => {
            if(!fajl) {
                res.send(JSON.stringify({message: 'Dati fajl ne postoji.'}));
            }
            else {
                res.writeHead(200, {
                    'Content-Type': fajl.file_type,
                    'Content-Length': fajl.file_size,
                    'Content-Disposition': `attachment; filename=${fajl.nazivFile}`
                });

                res.write(fajl.file, 'binary');
                res.end();
            }
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
            try {
                res.send(JSON.stringify({message: 'Doslo je do greske.'}));
            }
            catch(err) {}
        });
    }
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