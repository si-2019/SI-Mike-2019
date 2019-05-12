const express = require('express');
const generateRoute = express.Router();

const generateUtils = require('../../utils/asistantUtils/generateUtils');

// POST base/api/generate/generategroups
// [idProjekat] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewA/generategroups:
 *    post:
 *      tags:
*       - Asistenti - Generisanje projektnih grupa - Service
 *      description: Generisanje projektnih grupa na projektu
 */
generateRoute.post('/generategroups',(req,res)=>{

});

module.exports = generateRoute;