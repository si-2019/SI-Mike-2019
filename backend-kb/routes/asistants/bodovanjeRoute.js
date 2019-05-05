const express = require('express');
const bodovanjeRouter = express.Router();

const bodovanjeUtils = require('../../utils/asistantUtils/bodovanjeUtils');

bodovanjeRouter.post('/unified', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    bodovanjeUtils.provjeraParametaraBodovanjeProjektneGrupe(req.body, (cb) => {
        if(cb.ispravno) {
            bodovanjeUtils.upisBodovaProjektneGrupe(req.body, (err) => {
                if(err) {
                    res.send(JSON.stringify({
                        message: 'Doslo je do greske sa bazom.'
                    }));
                }
                else {
                    res.send(JSON.stringify({
                        message: 'Uspjesno bodovan projekat.'
                    }));
                }
            })
        }
        else
        {
            res.send(JSON.stringify({
                message: cb.poruka
            }));
        }
    });
});

module.exports = bodovanjeRouter;