const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

describe('Testiranje post metode base/services/work/assigntask', () => {
    
    it('Treba da vraca specifican json jer ne postoje projektni zadaci u bazi', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/work/assigntask`,
            body: {
                "idVodje" : 100,
                "zadaci" : [{
                            "idClanGrupe" : 57, "idProjektniZadatak": 250
                        }, {
                            "idClanGrupe" : 58, "idProjektniZadatak": 251
                        }] 
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal("Ne postoje svi projektni zadaci u bazi!");
            done();
        });
    });

    it('Treba da vraca specifican json jer poslani id korisnika nije kreator/vodja', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/work/assigntask`,
            body: {
                "idVodje" : 57,
                "zadaci" : [{
                            "idClanGrupe" : 57, "idProjektniZadatak": 250
                        }, {
                            "idClanGrupe" : 58, "idProjektniZadatak": 251
                        }] 
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal("Vodja nije kreator!");
            done();
        });
    });

    it('Treba da vraca specifican json jer ne postoje svi nabrojani clanovi', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/work/assigntask`,
            body: {
                "idVodje" : 100,
                "zadaci" : [{
                            "idClanGrupe" : 5723, "idProjektniZadatak": 260
                        }, {
                            "idClanGrupe" : 58, "idProjektniZadatak": 261
                        }] 
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal("Ne postoje svi clanovi u bazi!");
            done();
        });
    });

    it('Treba da vraca specifican json jer ne postoji poslaniVodja', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/work/assigntask`,
            body: {
                "idVodje" : 100111,
                "zadaci" : [{
                            "idClanGrupe" : 5723, "idProjektniZadatak": 260
                        }, {
                            "idClanGrupe" : 58, "idProjektniZadatak": 261
                        }] 
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal("Ne postoji poslani vodja!");
            done();
        });
    });

    it('Treba da vraca ispravan rezultat, radi ispravnog poziva', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/work/assigntask`,
            body: {
                "idVodje" : 100,
                "zadaci" : [{
                            "idClanGrupe" : 57, "idProjektniZadatak": 260
                        }, {
                            "idClanGrupe" : 58, "idProjektniZadatak": 261
                        }] 
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal("Uspiješno dodijeljeni zadaci svim članovima.");
            done();
        });
    });


});