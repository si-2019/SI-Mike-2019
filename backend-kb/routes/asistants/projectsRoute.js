const express = require('express');
const projectsRouter = express.Router();

const projectUtils = require('../../utils/asistantUtils/projectsUtils');

// POST base/api/projects/ 
// [id_predmeta, id_asistenta, opis_projekta, moguci_bodovi] obavezni parametar u bodiju posta
// [progress] se ne mora, a i može poslati, ako se ne pošalje smatra se default 0
// salje se kao url encoded format i prima i kao rezultat vraca json projektnog zadatka ukoliko je uspiješno dodan
// a ako nije json sa parametrom message koji govori da nije uspiješno dodan projektni zadatak za projekat

projectsRouter.post('/newp', (req, res) => {
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');

    let bool = projectUtils.provjeraParametaraPostPZ(postBody);
    if (!bool) res.send(JSON.stringify({ message: 'Body parametri nisu specifirani [naziv_projekta, id_predmeta, id_asistenta, opis_projekta, moguci_bodovi]' }));
    // ukoliko je sve zadovoljeno piše se u bazu novi projekat
    else {
        let progress = postBody['progress'];
        if(!progress) progress = 0.000;
        projectUtils.upisNovogProjektaUBazu(postBody, progress, (err, objekat) => {
            if (err) res.send(JSON.stringify({ message: 'Poslani [id_predmeta || id_asistenta] ne postoji u bazi ili je doslo do greske sa bazom!' }));
            else res.send(JSON.stringify(objekat));
        });
    }
});

projectsRouter.post('/setdeadline', (req, res) => {
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');

    let ret = projectUtils.provjeraParametaraRokProjekta(postBody);

    if (!ret.ispravno) res.send(JSON.stringify({ message: ret.poruka }));
    else {
        projectUtils.upisRokaIzradeProjekta(postBody, (err) => {
            if (err) res.send(JSON.stringify({ message: 'Poslani id predmeta ne postoji u bazi ili je doslo do greske sa bazom!' }));
            else res.send(JSON.stringify({ message: 'Uspjesno dodan rok izrade projekta.' }));
        });
    }
});

module.exports = projectsRouter;