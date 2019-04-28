const express = require('express');
const groupRouter = express.Router();

const groupUtils = require('../../utils/studentUtils/groupUtils');

// [idGrupaProjekta, idProjekat] obavezni parametari u bodiju posta
// [nazivGrupe, ostvareniBodovi, komentarAsistenta] neobavezni parametri u bodiju posta
groupRouter.post('/', (req, res) => {
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');

    let provjereno = groupUtils.provjeraParametaraPostG(postBody);
    if (!provjereno) res.send(JSON.stringify({ message: 'Body parametri nisu specifirani ili nisu u dobrom formatu [idGrupaProjekta, idProjekat, nazivGrupe, ostvareniBodovi, komentarAsistenta]' }));
    // ukoliko je sve zadovoljeno piše se u bazu nova grupa
    else {
        groupUtils.upisNoveGrupeUBazu(postBody, (err) => {
            if (err) res.send(JSON.stringify({ message: 'Poslani id projekta ne postoji u bazi ili je doslo do greske sa bazom!' }));
            else res.send(JSON.stringify({message: 'Uspjesno kreirana nova grupa u bazi. '}));
        });
    }
});
