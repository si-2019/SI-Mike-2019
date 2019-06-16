const express = require('express');
const progressRouter = express.Router();

const progressUtils = require('../../utils/studentUtils/progressUtil');

// POST base/api/progress/endtask
// [idProjektnogZadatka] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/progress/endtask:
 *    post:
 *      tags:
*       - Studenti - Pracenje progresa projekta - Service
 *      description: Oznacavanje projektnog zadatka zavrsenim
 */
progressRouter.post('/endtask/:id',(req,res)=>{
    progressUtils.oznaciZavrsen(req.params.id, (err) => {
        res.setHeader('Content-Type', 'application/json');
        res.end();
    });
});

// POST base/api/progress/endproject
// [idProjekta] obavezni parametar u bodiju posta
/**
 * @swagger
 * /services/progress/endproject:
 *    post:
 *      tags:
*       - Studenti - Pracenje progresa projekta - Service
 *      description: Oznacavanje projekta zavrsenim
 */
progressRouter.post('/endproject',(req,res)=>{

});

module.exports = progressRouter;