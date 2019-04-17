const express = require('express');
const projectsRouter = express.Router();

const projectUtils = require('../../utils/asistantUtils/projectsUtils');

// POST base/api/projects/ 
// [id_predmeta, id_asistenta, opis_projekta, moguci_bodovi] obavezni parametar u bodiju posta
// salje se kao url encoded format i prima i kao rezultat vraca json projektnog zadatka ukoliko je uspiješno dodan
// a ako nije json sa parametrom message koji govori da nije uspiješno dodan projektni zadatak za projekat

projectsRouter.post('/', (req, res) => {    
    let postBody = req.body;
    res.setHeader('Content-Type', 'application/json');
    
    let bool = projectUtils.provjeraParametaraPostPZ(postBody); 
    if (!bool) res.send(JSON.stringify({ message: 'Body parametri nisu specifirani [id_predmeta, id_asistenta, opis_projekta, moguci_bodovi]' }));
    else res.send(JSON.stringify({ a: 'vrati'}));   
    
});

module.exports = workRouter;