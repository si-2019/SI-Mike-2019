const express = require('express');
const groupRouter = express.Router();

const groupUtils = require('../../utils/studentUtils/groupUtils');

// [idGrupaProjekta, idProjekat] obavezni parametari u bodiju posta
// [nazivGrupe, ostvareniBodovi, komentarAsistenta] neobavezni parametri u bodiju posta
/**
 * @swagger
 * /services/group/:
 *    post:
 *      tags:
*       - Studenti - Kreiranje projektne grupe - Service 
 *      description: Omogucava kreiranje novih projektnih grupa
 */
groupRouter.post('/', (req, res) => {
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');

    let provjereno = groupUtils.provjeraParametaraPostG(postBody);
    if (!provjereno) res.send(JSON.stringify({
        message: 'Body parametri nisu specifirani ili nisu u dobrom formatu [idProjekat, nazivGrupe, ostvareniBodovi, komentarAsistenta]'
    }));
    // ukoliko je sve zadovoljeno piše se u bazu nova grupa
    else {
        groupUtils.upisNoveGrupeUBazu(postBody, (err) => {
            if (err) res.send(JSON.stringify({
                message: 'Poslani id projekta ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            else res.send(JSON.stringify({
                message: 'Uspjesno kreirana nova grupa u bazi.'
            }));
        });
    }
});

/**
 * @swagger
 * /services/group/addmembers:
 *    post:
 *      tags:
 *       - Studenti - Kreiranje projektne grupe - Service
 *      description: 'Omogucava dodavanje novih osoba u već postojeće grupe za definisanje projekte.
 *      Realizovano od strane: Mašović Haris'
*/
groupRouter.post('/addmembers', (req, res) => {
    let nizNovihMembera = req.body.payload;
    if(!nizNovihMembera){ res.send(JSON.stringify({ message: 'Nisu poslani memberi unutar payloada!' })); return; }
    if (!groupUtils.provjeraNovihMembera(nizNovihMembera)) res.send(JSON.stringify({
        message: 'Svaki member u JSON body-u ne sadrži [idStudent, idGrupaProjekta]!'
    }));
    else {
        groupUtils.upisNovihMemberaUBazu(nizNovihMembera, (err) => {
            if (err) res.send(JSON.stringify({
                message: 'Doslo je do greske prilikom upisivanja u bazu ili poslani podaci u json formatu nisu registrovani/referencirani u bazi podataka!',
                err
            }));
            else res.send(JSON.stringify({
                message: 'Uspjesno dodani novi clanovi za grupe koji nisu vec bili u tim grupama!'
            }));
        });
    }
});

// POST base/api/group/selectleader
// [idClanGrupe] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/group/selectleader:
 *    post:
 *      tags:
*       - Studenti - Kreiranje projektne grupe - Service
 *      description: Izbor vođe generisane grupe
 */
groupRouter.post('/selectleader', (req, res) => {
    let idClanaGrupe=req.body.id;
    groupUtils.upisVodjeGrupe(idClanaGrupe,(err)=>{
        if(err) res.send(JSON.stringify({
            message: 'Greska prilikom upisa vodje grupe!',
            err
        }));
        else res.send(JSON.stringify({
            message: 'Uspjesno upisan vodja grupe!'
        }));
    });
});



module.exports = groupRouter;