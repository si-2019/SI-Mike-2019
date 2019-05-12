const express = require('express');
const progressRouter = express.Router();

// POST base/api/progress/endtask
// [idProjektnogZadatka] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/progress/endtask:
 *    post:
 *      tags:
*       - Studenti - Pracenje progresa projekta - API
 *      description: Oznacavanje projektnog zadatka zavrsenim
 */
progressRouter.post('/endtask',(req,res)=>{

});

// POST base/api/progress/endproject
// [idProjekta] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/progress/endproject:
 *    post:
 *      tags:
*       - Studenti - Pracenje progresa projekta - API
 *      description: Oznacavanje projekta zavrsenim
 */
progressRouter.post('/endproject',(req,res)=>{

});

module.exports = progressRouter;