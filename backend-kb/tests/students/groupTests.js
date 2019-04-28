const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

const uuidv4 = require('uuid/v4');

describe('Testiranje post metode base/api/group', () => {
    
    it('Treba da vrati gresku jer id projekta nije uredu', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/group`,
            body:    encodeURI("idProjekat=56") // u bazi je dummy 3
        }, function (error, response, body) {
            let projekat = JSON.parse(body);
            expect(projekat.idProjekat).to.equal('56');
            done();
        });
    });

    it('Treba da unese novu grupu i provjeri u bazi da li je unesena', (done) => {  
        let random = uuidv4();    
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/projects/newp`,
            body:    encodeURI(`idGrupaProjekta=5&idProjekat=3&nazivGrupe=Najbolja&ostvareniBodovi=555&komentarAsistenta=sjajno${random}`)
        }, function (error, response, body) {
            let novi = body ? JSON.parse(body) : null;
            db.GrupaProjekta.findOne({
                where : {
                    idGrupaProjekta : 5
                }
            }).then((rez) => {
                expect(novi.idGrupaProjekta).to.equal('5');
                expect(rez.idProjekat).to.equal('3');
                expect(novi.nazivGrupe).to.equal('Najbolja');
                expect(novi.ostvareniBodovi).to.equal('555');
                expect(novi.komentarAsistenta).to.equal('sjajno');
                done();
            });
        }); 
    }); 

});