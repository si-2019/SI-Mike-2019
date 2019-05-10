const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

const uuidv4 = require('uuid/v4');
const db = require('../../models/db');

describe('Testiranje post metode base/api/group', () => {
    
    it('Treba da vrati gresku jer id projekta nije uredu', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/group`,
            body:    encodeURI("idGrupaProjekta=5&idProjekat=56&nazivGrupe=Najbolja&ostvareniBodovi=555&komentarAsistenta=sjajno") 
        }, function (error, response, body) {
            let projekat = JSON.parse(body);
            expect(projekat.idProjekat).to.equal('56');
            
        });
        done();
    });

    it('Treba da unese novu grupu i provjeri u bazi da li je unesena', (done) => {  
        let random = uuidv4();    
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/group`,
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
                
            });
            
        }); 
        done();
    });
    it('Treba da postavi studenta za vodju grupe', (done)=>{
        let testni={
            idClanGrupe:100,
            idStudent:5,
            idGrupaProjekta:1,
            ostvareniBodovi:10,
            kreator:null
        }
        db.ClanGrupe.Create(testni).then(
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                url: `${process.env.FULL_NAME}/api/group/selectleader`,
                body:    encodeURI(`id=100`)
            }, function(error,response,body){
                db.ClanGrupe.findOne({
                    where:{
                        idClanGrupe:100
                    }
                }).then((rez)=>{
                    expect(rez.kreator).to.equal('true');
                });
            })
        );
    });
});