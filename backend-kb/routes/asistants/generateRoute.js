const express = require('express');
const generateRouter = express.Router();

const generateUtils = require('../../utils/asistantUtils/generateUtils');

// POST base/services/generate/generategroups
// [idProjekat] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/viewA/generategroups:
 *    post:
 *      tags:
*       - Asistenti - Generisanje projektnih grupa - Service
 *      description: Generisanje projektnih grupa na projektu
 */
generateRouter.post('/generategroups',(req,res)=>{

});

module.exports = generateRouter;