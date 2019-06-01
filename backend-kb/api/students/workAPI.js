const express = require('express');
const workRouter = express.Router();

/**
 * @swagger
 * /api/work/:
 *    post:
 *      tags:
 *       - Studenti - Rad na projektu - API
 *      description: 'Omogucava dodavanje projektnih zadataka za vec postojeci projekat. 
 *      Salje se kao url encoded format i prima i kao rezultat vraca json projektnog zadatka ukoliko je uspješno dodana 
 *      ako nije json sa parametrom message koji govori da nije uspješno dodan projektni zadatak za projekat. 
 *      Realizovano od strane: Mašović Haris'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: id_projekta
 *          type: number
 *          description: ID projekta npr ~ [29].
 *        - in: formData
 *          name: od_kad
 *          type: string
 *          description: datum od kada npr ~ [2019-11-03 23:00:00].
 *        - in: formData
 *          name: do_kad
 *          type: string
 *          description: datum do kada npr ~ [2019-11-03 23:00:00].
 *        - in: formData
 *          name: opis
 *          type: string
 *          description: opis projektnog zadatka.
 *        - in: formData
 *          name: zavrsen
 *          type: boolean
 *          description: zavrsen projektni zadatak?.
 *        - in: formData
 *          name: komentar_asistenta
 *          type: string
 *          description: komentar asistenta.
 *      required:
 *        - id_projekta
 *        - od_kad
 *        - do_kad
 *      responses:
 *       200:
 *         description: Vraca se JSON objekat sa parametrom message
 *         content: 
 *           application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                  message:
 *                   type: string
*/
workRouter.post('/', (req, res) => res.redirect(307, '/services/work/')); 

// POST base/api/work/addfile
// [idProjektnogZadatka] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/work/addfile:
 *    post:
 *      tags:
 *       - Studenti - Rad na projektu - API
 *      description: 'Omogucava dodavanje fajlova u postojeci projektni zadatak. 
 *      Salje se kao multipart/form-data format i prima id projektnog zadatka i niz fajlova. 
 *      Vraca JSON sa parametrom message koji govori da li je fajl uspješno dodan u projektni zadatak. 
 *      Upload proizvoljnog broja fajlova nije podrzan u Swagger-u!
 *      Realizovano od strane: Skopljak Emin'
 *      consumes:
 *       - multipart/form-data
 *      parameters:
 *        - in: formData
 *          name: idProjektnogZadatka
 *          type: number
 *          description: ID projektnog zadatka za koji se veže fajl.
 *        - in: formData
 *          name: fajlovi
 *          type: file
 *          description: Uploadani fajlovi.
 *      required:
 *        - id_projekta
 *        - fajlovi
 *      responses:
 *       200:
 *         description: Vraca se JSON objekat sa parametrom message
 *         content: 
 *           application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                  message:
 *                   type: string
*/
workRouter.post('/addfile',(req, res)=>{
    res.redirect(307, '/services/work/addfile')
});

/**
 * @swagger
 * /api/work/downloadProjektniFajl:
 *    get:
 *      tags:
 *       - Studenti - Rad na projektu - API
 *      description: 'Omogucava download fajla iz projektnog zadatka. 
 *      Salje se kao url encoded format i prima id projektnog fajla. 
 *      Vraca binarni fajl u slucaju ispravnog zahtjeva, ili JSON sa parametrom message u slucaju greske.
 *      Realizovano od strane: Skopljak Emin'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: idProjektnogFajla
 *          type: number
 *          description: ID projektnog fajla.
 *      required:
 *        - idProjektnogFajla
 *      responses:
 *       200:
 *         description: Binarni fajl
*/
workRouter.get('/downloadProjektniFajl',(req, res)=>{
    res.redirect(307, '/services/work/downloadProjektniFajl')
});

/**
 * @swagger
 * /api/work/deleteAllFiles:
 *    get:
 *      tags:
 *       - Studenti - Rad na projektu - API
 *      description: 'Omogucava vodji grupe brisanje svih fajlova projektnih zadataka clanova grupe. 
 *      Salje se kao url encoded format i prima id grupe. 
 *      Vraca JSON sa parametrom message koji govori da li je operacija uspjesno obavljena.
 *      Realizovano od strane: Skopljak Emin'
 *      consumes:
 *       - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: idGrupaProjekta
 *          type: number
 *          description: ID projektne grupe.
 *      required:
 *        - idGrupaProjekta
 *      responses:
 *       200:
 *         description: Vraca se JSON objekat sa parametrom message
 *         content: 
 *           application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                  message:
 *                   type: string
*/
workRouter.post('/deleteAllFiles',(req, res)=>{
    res.redirect(307, '/services/work/deleteAllFiles')
});

/**
 * @swagger
 * /api/work/assigntask:
 *    post:
 *      tags:
 *       - Studenti - Rad na projektu - API
 *      description: 'Dodjela projektnog zadatka clanu grupe od studenta vođe ekipe. Realizovano od strane: Mašović Haris.'
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         schema:
 *          type: object
 *          properties:
 *           idKreator:
 *            type: integer
 *           noviZadaci:
 *            type: array
 *            items:
 *             type: object
 *             properties:
 *               idClanGrupe:
 *                type: integer
 *               idProjektniZadatak:
 *                type: integer
 *             required:
 *              - idClanGrupe
 *              - idProjektniZadatak
 *          required:
 *           - idKreator
 */
workRouter.post('/assigntask', (req, res) => res.redirect(307, '/services/work/assigntask'));

// POST base/api/work/deletefile
// [idFajla] obavezni parametar u bodiju posta
/**
 * @swagger
 * /api/work/deletefile:
 *    post:
 *      tags:
*       - Studenti - Rad na projektu - API
 *      description: Brisanje fajla iz projektnog zadatka
 */
workRouter.post('/deletefile',(req,res)=>{

});

module.exports = workRouter;