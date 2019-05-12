const express = require('express');
const generateRouter = express.Router();

const generateUtils = require('../../utils/asistantUtils/generateUtils');

// POST base/api/generate/generategroups
// [idProjekat] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/viewA/generategroups:
 *    post:
 *      tags:
*       - Asistenti - Generisanje projektnih grupa - API
 *      description: Generisanje projektnih grupa na projektu
 */
generateRouter.post('/generategroups',(req,res)=>{

});

module.exports = generateRouter;