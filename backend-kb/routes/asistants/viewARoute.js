const express = require('express');
const viewARouter = express.Router();

const viewUtils = require('../../utils/asistantUtils/viewAUtils');

// POST base/api/viewA/acourses
// [idUser] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewA/acourses:
 *    post:
 *      tags:
*       - Asistenti - Pregled projekata - Service
 *      description: Dohvatanje svih predmeta asistenta na kojim je aktivan projekat
 */
viewARouter.post('/acourses',(req,res)=>{

});

// POST base/api/viewA/projectgroups
// [idProjekt] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewA/projectgroups:
 *    post:
 *      tags:
*       - Asistenti - Pregled projekata - Service
 *      description: Dohvatanje svih projektnih grupa na projektu
 */
viewARouter.post('/projectgroups',(req,res)=>{

});

// POST base/api/viewA/commenttask
// [idProjektnogZadatka] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewA/commenttask:
 *    post:
 *      tags:
*       - Asistenti - Pregled projekata - Service
 *      description: Unos komentara na projektni zadatak
 */
viewARouter.post('/commenttask',(req,res)=>{

});

// POST base/api/viewA/commentproject
// [idProjekt] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewA/commentproject:
 *    post:
 *      tags:
*       - Asistenti - Pregled projekata - Service
 *      description: Unos komentara na projekat
 */
viewARouter.post('/commentproject',(req,res)=>{

});

//Get projekat

viewARouter.post('/getProject',(req,res)=>{
    var predmet=req.body.idPredmet;
    viewUtils.dohvatiProjekat(predmet).then((jsonString)=>{
        res.writeHead(200,{'Content-Type':'application/json'});
        res.write(jsonString);
        res.end();
    });
});

// custom servisi - no need 4 swagger
viewARouter.get('/predmetiprojekti', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    viewUtils.dohvatiSvePredmeteProjekte((err, podaci) => {
        if (err) res.send(JSON.stringify({
            message: 'errr'
        }));
        else res.send(JSON.stringify(podaci));
    });
});

viewARouter.get('/getProjects/:idStudent',(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    let idStudenta = req.params.idStudent;
    viewUtils.dajSveProjekteStudenta(idStudenta, (err, projekti) => {
        if (err) res.send(JSON.stringify({
            message: 'errr'
        }));
        else res.send(JSON.stringify(projekti));
    });
});

viewARouter.get('/getZadaci/:projektnaGrupa',(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    let idProjektne = req.params.projektnaGrupa;
    viewUtils.dajSvePRojektneZadatkeGrupe(idProjektne, (err, projekti) => {
        if (err) res.send(JSON.stringify({
            message: 'errr'
        }));
        else res.send(JSON.stringify(projekti));
    });
});

viewARouter.get('/getClanovi/:projektnaGrupa',(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    let idProjektne = req.params.projektnaGrupa;
    viewUtils.dajSveClanoveProjektne(idProjektne, (err, projekti) => {
        if (err) res.send(JSON.stringify({
            message: 'errr'
        }));
        else res.send(JSON.stringify(projekti));
    });
});

viewARouter.get('/predmetiprojektiasistent/:idAsistent', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let idAsistent=req.params.idAsistent;
    viewUtils.dajPredmeteAsistenta(idAsistent,(err, podaci) => {
        if (err) res.send(JSON.stringify({
            message: 'errr'
        }));
        else res.send(JSON.stringify(podaci));
    });
});
module.exports = viewARouter;