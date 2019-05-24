const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

describe('Testiranje post metode base/services/bodovanjeprojekata/tasks', () => {
    
    it('Treba da vraca specifican json jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/tasks`,
            body: [{
                "idProjektniZadatak123" : 244,
                "komentarAsistenta23" : "ne valja",
                "ostvareniBodovi": 10,
                "idProjekat" : 29
            },{
                "idProjektniZadatak" : 242,
                "komentarAsistenta" : "valja",
                "ostvareniBodovi1": 5,
                "idProjekat" : 29
            }],
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Format podataka nije pravilo definisan.');
            done();
        });
    });

    it('Treba da vraca specifican json jer nisu zadovoljene reference', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/tasks`,
            body: [{
                "idProjektniZadatak" : 244232,
                "komentarAsistenta" : "ne valja",
                "ostvareniBodovi": 10,
                "idProjekat" : 29
            },{
                "idProjektniZadatak" : 24232,
                "komentarAsistenta" : "valja",
                "ostvareniBodovi": 5,
                "idProjekat" : 29
            }],
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Nijedan projektni zadatak ne postoji u bazi/nije bodovan.');
            done();
        });
    });

    it('Treba da vraca ispravnu poruku jer je sve zadovoljenoc', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/tasks`,
            body: [{
                "idProjektniZadatak" : 244,
                "komentarAsistenta" : "ne valja",
                "ostvareniBodovi": 10,
                "idProjekat" : 29
            },{
                "idProjektniZadatak" : 242,
                "komentarAsistenta" : "valja",
                "ostvareniBodovi": 5,
                "idProjekat" : 29
            }],
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Uspješno bodovan svaki projektni zadatak!');
            done();
        });
    });

});