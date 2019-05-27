const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

describe('Testiranje post metode base/services/bodovanjeprojekata/specified', () => {
    
    it('Treba da vraca specifican json jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/specified`,
            body: {
                "projekat_ne_valja" : 29,
                "payload" : [{"idStudent" : 1, "idGrupaProjekta" : 1, "ostvareniBodovi" : 50}, 
                             {"idStudent" : 2, "idGrupaProjekta" : 1, "ostvareniBodovi" : 30}]
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Projekat/Payload parametri ispravno nisu definisani!');
            done();
        });
    });

    it('Treba da vraca specifican json jer nije zadovoljen max broj bodova', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/specified`,
            body: {
                "projekat_ne_valja" : 29,
                "payload" : [{"idStudent" : 1, "idGrupaProjekta" : 1, "ostvareniBodovi" : 500}, 
                             {"idStudent" : 2, "idGrupaProjekta" : 1, "ostvareniBodovi" : 30}]
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Projekat/Payload parametri ispravno nisu definisani!');
            done();
        });
    });

    it('Treba da vraca specifican json jer nije id projekta zadovoljeno u bazi podataka', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/specified`,
            body: {
                "projekat" : 293,
                "payload" : [{"idStudent" : 1, "idGrupaProjekta" : 1, "ostvareniBodovi" : 30}, 
                             {"idStudent" : 2, "idGrupaProjekta" : 1, "ostvareniBodovi" : 30}]
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Poslani id projekta ne postoji u bazi!');
            done();
        });
    });

    it('Treba da vrati ocekivani rezultat i da upise nove updateovane bodove', (done) => {
        request.post({
            headers: {
                'content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/specified`,
            body: {
                "projekat" : 29,
                "payload" : [{"idStudent" : 1, "idGrupaProjekta" : 1, "ostvareniBodovi" : 50}, 
                             {"idStudent" : 2, "idGrupaProjekta" : 1, "ostvareniBodovi" : 50}]
            },
            json : true
        }, function (error, response, body) {
            expect(body.message).to.equal('Uspjesno bodovan svaki clan grupe za definisani projekat.');
            done();
        });
    });
});