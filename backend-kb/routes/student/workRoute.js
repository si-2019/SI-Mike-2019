const express = require('express');
const workRouter = express.Router();

const workUtils = require('../../utils/studentUtils/workUtils');

// POST base/api/work/ 
// [id_projekta, prioritet, od_kad, do_kad] obavezni parametar u bodiju posta
// [opis, zavrsen, komentar_asistenta] nisu obavezni parametri za ovaj post
// salje se kao json format i prima i kao rezultat vraca json projektnog zadatka ukoliko je uspiješno dodan
// a ako nije json sa parametrom message koji govori da nije uspiješno dodan projektni zadatak za projekat

workRouter.post('/', (req, res) => {    
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');
    
    let bool = workUtils.provjeraParametaraPostPZ(postBody); 
    if (!bool) res.send(JSON.stringify({ message: 'Body parametri nisu specifirani [id_projekta, prioritet, od_kad, do_kad]' }));
    else {
        let opis = "";
        let zavrsen = false;
        let komentar_a = "";
        if(postBody['opis']) opis = postBody['opis'];
        if(postBody['zavrsen']) zavrsen = postBody['zavrsen'];
        if(postBody['komentar_asistenta']) komentar_a = postBody['komentar_asistenta'];

        let objekat = workUtils.upisNovogPZuBazu(postBody, opis, zavrsen, komentar_a);
        res.send(JSON.stringify(objekat));
    }
});

module.exports = workRouter;