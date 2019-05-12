const express = require('express');
const viewRoute = express.Router();

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
viewRoute.post('/acourses',(req,res)=>{

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
viewRoute.post('/projectgroups',(req,res)=>{

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
viewRoute.post('/commenttask',(req,res)=>{

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
viewRoute.post('/commentproject',(req,res)=>{

});

module.exports = viewRoute;