const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const db = require('../../models/db');

describe('Testiranje post metode base/services/generate/genOrdered', () => {

    it('Treba da vraca gresku jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/generate/genOrdered`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani [idProjekat, brojGrupa]'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer idProjekat ne postoji u bazi ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/generate/genOrdered`,
            body: encodeURI("idProjekat=15678&brojGrupa=10")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Poslani ID projekta ne postoji.'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer je broj grupa manji od jedan', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/generate/genOrdered`,
            body: encodeURI("idProjekat=77&brojGrupa=-1")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Broj grupa mora biti veci ili jednak 1.'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer je broj grupa veci od broja studenata', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/generate/genOrdered`,
            body: encodeURI("idProjekat=77&brojGrupa=100000")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Doslo je do greske.'
            }));
            done();
        });
    });

    it('Treba da ispravno izvrsi kreiranje projektnih grupa abecednim redom', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/generate/genOrdered`,
            body: encodeURI("idProjekat=78&brojGrupa=2")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Uspjesno kreirane projektne grupe.'
            }));
            
            db.GrupaProjekta.findAll({
                where: {
                    idProjekat: 78
                }
            }).then((grupe) => {
                expect(grupe.length > 1).to.equal(true);
                done();
            })
        });
    });
});
