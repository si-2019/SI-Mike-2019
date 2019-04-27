const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

const uuidv4 = require('uuid/v4');
const db = require('../../models/db');

describe('Testiranje post metode base/api/work', () => {
    

    it('Treba da vraca specifican json jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani [id_projekta, od_kad, do_kad]'
            }));
            done();
        });
    });
    
    it('Treba da vrati gresku da datumi nisu uredu!', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`,
            body:    encodeURI("id_projekta=3&od_kad=2019-14-03 23:00:00&do_kad=2019-12-03 23:00:00") // u bazi je dummy 3
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Datumi nisu u formatu [yyyy-mm-dd hh:mm:ss]!'
            }));
            done();
        });
    });
    
    it('Treba da vrati gresku jer id_projekta nije zadovoljen', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`,
            body:    encodeURI("id_projekta=55&od_kad=2019-11-03 23:00:00&do_kad=2019-12-03 23:00:00") // u bazi je dummy 3
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Poslani [id_projekta] ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            done();
        });
    });

    
    it('Treba da vraca isti body koji je poslan, jer je zadovoljeno sve', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`,
            body:    encodeURI("id_projekta=29&od_kad=2019-11-03 23:00:00&do_kad=2019-12-03 23:00:00") // u bazi je dummy 29
        }, function (error, response, body) {
            let novi = JSON.parse(body);
            expect(novi.idProjekta).to.equal('29');
            expect(novi.otkad).to.equal('2019-11-03 23:00:00');
            expect(novi.dokad).to.equal('2019-12-03 23:00:00');
            done();
        });
    });

    
    it('Treba da unese u bazu novi projektni zadatak pod id_projektom 3 i ujedno upise u bazu', (done) => {  
        let random = uuidv4();    
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`,
            body:    encodeURI(`id_projekta=29&od_kad=2019-11-03 23:00:00&do_kad=2019-12-03 23:00:00&opis=${random}`) // dummy 29
            // u bazi je dummy 3
        }, function (error, response, body) {
            let novi = JSON.parse(body);

            db.ProjektniZadatak.findOne({
                where : {
                    opis : random
                }
            }).then((pz) => {
                expect(novi.idProjekta).to.equal('29');
                expect(novi.otkad).to.equal('2019-11-03 23:00:00');
                expect(novi.dokad).to.equal('2019-12-03 23:00:00');
                expect(pz.opis).to.equal(random);
                done();
            }); 
        });
    });     

});