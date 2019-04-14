const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const uuidv4 = require('uuid/v4');
const connection = require('../../db').connection;

describe('Testiranje kreiranja projektnih zadataka na backend strani putem POST metode', () => {
    it('Greska ako nema tijela zahtjeva:', (done) => {
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
    
    it('Body je ispravnog formata, ali ID ne postoji u bazi:', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`,
            body:    encodeURI("id_projekta=1000&od_kad=2019-01-01 01:00:00&do_kad=2019-01-01 02:00:00") 
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Poslani [id_projekta] ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            done();
        });
    });
    
    it('Unos novog zadatka za projekat sa ID=3:', (done) => {  
        let random = uuidv4();    
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`,
            body:    encodeURI(`id_projekta=3&od_kad=2019-01-01 01:00:00&do_kad=2019-01-01 02:00:00&opis=${random}`) 
        }, function (error, response, body) {
            let novi = JSON.parse(body);

            connection.query(`SELECT * FROM ProjektniZadatak WHERE opis='${random}'`, (error, results1, fields) => {
                expect(novi.id_projekta).to.equal('3');
                expect(novi.od_kad).to.equal('2019-01-01 01:00:00');
                expect(novi.do_kad).to.equal('2019-01-01 02:00:00');

                let provjeraBaze = JSON.parse(JSON.stringify(results1));
                expect(provjeraBaze.length).to.equal(1);
                expect(provjeraBaze[0].opis).to.equal(random);
                done();
            });
        });
    }); 

    it('Greska ako je pogresan format datuma:', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`,
            body:    encodeURI("id_projekta=3&od_kad=2019-05-05 00:00:00&do_kad=2019-05-40 00:00:00") 
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Datumi nisu u formatu [yyyy-mm-dd hh:mm:ss]!'
            }));
            done();
        });
    });

});