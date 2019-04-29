const express = require('express');
const groupRouter = express.Router();

const groupUtils = require('../../utils/studentUtils/groupUtils');

// [idGrupaProjekta, idProjekat] obavezni parametari u bodiju posta
// [nazivGrupe, ostvareniBodovi, komentarAsistenta] neobavezni parametri u bodiju posta
groupRouter.post('/', (req, res) => {
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');

    let provjereno = groupUtils.provjeraParametaraPostG(postBody);
    if (!provjereno) res.send(JSON.stringify({
        message: 'Body parametri nisu specifirani ili nisu u dobrom formatu [idGrupaProjekta, idProjekat, nazivGrupe, ostvareniBodovi, komentarAsistenta]'
    }));
    // ukoliko je sve zadovoljeno piše se u bazu nova grupa
    else {
        groupUtils.upisNoveGrupeUBazu(postBody, (err) => {
            if (err) res.send(JSON.stringify({
                message: 'Poslani id projekta ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            else res.send(JSON.stringify({
                message: 'Uspjesno kreirana nova grupa u bazi. '
            }));
        });
    }
});

// POST base/api/group/addmembers 
// [idStudent, idGrupaProjekta] obavezni parametari u json nizu unutar body posta
// [kreator] nije obavezan, ali ukoliko se pošalje smatra se da je ta osoba vođa grupe
// salje se kao json format, a kao rezultat vraca json sa uspjesnom porukom
// a ako nije json sa parametrom message koji govori šta nije bilo uspješno

groupRouter.post('/addmembers', (req, res) => {
    let nizNovihMembera = req.body;

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



module.exports = groupRouter;