const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

describe('Testiranje post metode base/services/group/addmembers', () => {
    
    it('Treba da vraca specifican json jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/group/addmembers`,
            body: {"payload" : [{
                "idStudent2" : "1",
                "idGrupaProjekta" : "1"
            }, {
                "idStudent" : "2",
                "idGrupaProjekta" : "1",
                "kreator" : "1"
            }]},
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Svaki member u JSON body-u ne sadrži [idStudent, idGrupaProjekta]!');
            done();
        });
    });
    
    it('Treba da vraca specifican json jer nije zadovoljena validnost idStudent parametara unutar body', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/group/addmembers`,
            body: {"payload" : [{
                "idStudent" : "1232323232322",
                "idGrupaProjekta" : "1"
            }, {
                "idStudent" : "2",
                "idGrupaProjekta" : "1",
                "kreator" : "1"
            }]},
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Doslo je do greske prilikom upisivanja u bazu ili poslani podaci u json formatu nisu registrovani/referencirani u bazi podataka!');
            done();
        });
    });

    it('Treba da vrati ocekivani rezultat i da upise u bazu ukoliko ti clanovi vec nisu u grupi', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/group/addmembers`,
            body: {"payload" : [{
                "idStudent" : "1",
                "idGrupaProjekta" : "1"
            }, {
                "idStudent" : "2",
                "idGrupaProjekta" : "1"
            }]},
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Uspjesno dodani novi clanovi za grupe koji nisu vec bili u tim grupama!');
            done();
        });
    });



});