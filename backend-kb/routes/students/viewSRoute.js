const express = require('express');
const viewSRoute = express.Router();

const viewSUtils = require('../../utils/studentUtils/viewSUtils');

// POST base/api/viewS/projects
// [idUser] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewS/projects:
 *    post:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Dohvatanje svih projekata studenta
 */
viewSRoute.post('/projects',(req,res)=>{

});

// POST base/api/viewS/tasks
// [idProjekat] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewS/tasks:
 *    post:
 *      tags:
*       - Studenti - Pregled projekata - Service
 *      description: Dohvatanje svih zadataka na projektu
 */
viewSRoute.post('/tasks',(req,res)=>{

});

module.exports = viewSRoute;