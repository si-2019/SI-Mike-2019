const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const db = require('../../models/db');

describe('Testiranje post metode base/services/work/deleteAllFiles', () => {

    it('Treba da vraca gresku jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/work/deleteAllFiles`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani: idGrupaProjekta.'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer idGrupaProjekta ne postoji u bazi ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/work/deleteAllFiles`,
            body: encodeURI("idGrupaProjekta=20003")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Grupa sa datim ID ne postoji.'
            }));
            done();
        });
    });

    it('Treba da ispravno izvrsi brisanje projektnih fajlova iz date grupe (testni podaci iz baze)', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/work/deleteAllFiles`,
            body: encodeURI("idGrupaProjekta=1")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Uspjesno obrisani fajlovi.'
            }));
            
            db.ProjektniFile.findAll({
                where: {
                    idProjektniZadatak: 242
                }
            }).then((fajlovi) => {
                expect(fajlovi.length == 0).to.equal(true);
                done();
            })
        });
    });
});
