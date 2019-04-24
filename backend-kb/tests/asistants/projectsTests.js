const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

const uuidv4 = require('uuid/v4');
const connection = require('../../db').connection;

describe('Testiranje post metode base/api/projects/newp', () => {
    
    it('Treba da vraca specifican json jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/projects/newp`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani [naziv_projekta, id_predmeta, id_asistenta, opis_projekta, moguci_bodovi]'
            }));
            done();
        });
    });
    
    it('Treba da vrati gresku jer id_asistenta nema u bazi ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/projects/newp`,
            body:    encodeURI("id_asistenta=10003&id_predmeta=2&opis_projekta=hahah&moguci_bodovi=1337&naziv_projekta=mashin")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Poslani [id_predmeta || id_asistenta] ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            done();
        });
    });
    
    it('Treba da vrati gresku jer id_predmeta nema u bazi ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/projects/newp`,
            body:    encodeURI("id_asistenta=1&id_predmeta=100002&opis_projekta=hahah&moguci_bodovi=1337&naziv_projekta=mashin")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Poslani [id_predmeta || id_asistenta] ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            done();
        });
    });

    
    
    it('Treba da unese vrati novi projekat i provjeri u bazi jel uneseno', (done) => {  
        let random = uuidv4();    
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/projects/newp`,
            body:    encodeURI(`id_predmeta=3&id_asistenta=2&opis_projekta=hahah&moguci_bodovi=1337&naziv_projekta=${random}`)
        }, function (error, response, body) {
            let novi = body ? JSON.parse(body) : null;
            connection.query(`SELECT * FROM Projekat WHERE nazivProjekta='${random}'`, (error, results1, fields) => {
                expect(novi.id_predmeta).to.equal('3');
                expect(novi.id_asistenta).to.equal('2');
                expect(novi.opis_projekta).to.equal('hahah');
                expect(novi.moguci_bodovi).to.equal('1337');

                let provjeraBaze = JSON.parse(JSON.stringify(results1));
                expect(provjeraBaze.length).to.equal(1);
                expect(provjeraBaze[0].nazivProjekta).to.equal(random);

                done();
            });
        }); 
    }); 
});