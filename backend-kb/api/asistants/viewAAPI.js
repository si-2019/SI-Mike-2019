const express = require('express');
const viewARouter = express.Router();

// POST base/api/viewA/acourses
// [idUser] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/viewA/acourses:
 *    post:
 *      tags:
*       - Asistenti - Pregled projekata - API
 *      description: Dohvatanje svih predmeta asistenta na kojim je aktivan projekat
 */
viewARouter.post('/acourses',(req,res)=>{

});

// POST base/api/viewA/projectgroups
// [idProjekt] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/viewA/projectgroups:
 *    post:
 *      tags:
*       - Asistenti - Pregled projekata - API
 *      description: Dohvatanje svih projektnih grupa na projektu
 */
viewARouter.post('/projectgroups',(req,res)=>{

});

// POST base/api/viewA/commenttask
// [idProjektnogZadatka] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/viewA/commenttask:
 *    post:
 *      tags:
*       - Asistenti - Pregled projekata - API
 *      description: Unos komentara na projektni zadatak
 */
viewARouter.post('/commenttask',(req,res)=>{

});

// POST base/api/viewA/commentproject
// [idProjekt] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/viewA/commentproject:
 *    post:
 *      tags:
*       - Asistenti - Pregled projekata - API
 *      description: Unos komentara na projekat
 */
viewARouter.post('/commentproject',(req,res)=>{

});

module.exports = viewARouter;