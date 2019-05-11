const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const db = require('../../models/db');

describe('Testiranje post metode base/services/projects/setdeadline', () => {

    it('Treba da vraca gresku jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/projects/setdeadline`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani [idProjekat, rokProjekta]'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer idProjekat nema u bazi ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/projects/setdeadline`,
            body: encodeURI("idProjekat=15678&rokProjekta=2017-08-08 23:04:05")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Poslani id projekta ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer datum nije u ispravnom formatu ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/projects/setdeadline`,
            body: encodeURI("idProjekat=1&rokProjekta=3044-01-01 24:23:75")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Datum nije u formatu [yyyy-mm-dd hh:mm:ss]!'
            }));
            done();
        });
    });

    it('Treba da postavi rok projekta ispravno', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/projects/setdeadline`,
            body: encodeURI(`idProjekat=29&rokProjekta=2019-08-01 20:20:20`)
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Uspjesno dodan rok izrade projekta.'
            }));

            db.Projekat.findOne({
                where: {
                    idProjekat: 29
                }
            }).then((rez) => {
                expect(rez.rokProjekta).to.equal('2019-08-01 20:20:20');
                done();
            })
        });
    });
});