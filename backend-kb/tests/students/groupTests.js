const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

const uuidv4 = require('uuid/v4');
const db = require('../../models/db');

describe('Testiranje post metode base/services/group', () => {
    
    it('Treba da vrati gresku jer id projekta nije uredu', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/group`,
            body:    encodeURI("idProjekat=29&nazivGrupe=sumadinci") 
        }, function (error, response, body) {
            let novi = body ? JSON.parse(body) : null;
            expect(novi.message).to.equal('Uspjesno kreirana nova grupa u bazi.');
            done();
        });
    });

    it('Treba da unese novu grupu i provjeri u bazi da li je unesena', (done) => {  
        let random = uuidv4();    
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/group`,
            body:    encodeURI(`idProjekat=29&nazivGrupe=Najbolja&ostvareniBodovi=5&komentarAsistenta=${random}`)
        }, function (error, response, body) {
            db.GrupaProjekta.findOne({
                where : {
                    komentarAsistenta : random
                }
            }).then((rez) => {
                expect(rez.idProjekat).to.equal(29);
                expect(rez.nazivGrupe).to.equal('Najbolja');
                expect(rez.ostvareniBodovi).to.equal(5);
                done();
            });     
        }); 
    });
});