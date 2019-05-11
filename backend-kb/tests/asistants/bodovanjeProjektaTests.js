const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const db = require('../../models/db');

describe('Testiranje post metode base/services/bodovanjeprojekata/unified', () => {

    it('Treba da vraca gresku jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/unified`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani [idGrupaProjekta, bodovi]'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer idGrupaProjekta ne postoji u bazi ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/unified`,
            body: encodeURI("idGrupaProjekta=15678&bodovi=10")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Pogresan ID grupe.'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer su bodovi manji od nule', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/unified`,
            body: encodeURI("idGrupaProjekta=1&bodovi=-1")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Bodovi moraju biti u intervalu [0, max].'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer su bodovi veci od maksimalnih za projekat', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/unified`,
            body: encodeURI("idGrupaProjekta=1&bodovi=100000")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Bodovi moraju biti u intervalu [0, max].'
            }));
            done();
        });
    });

    it('Treba da ispravno izvrsi upis bodova projekta u bazu za sve clanove', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/unified`,
            body: encodeURI("idGrupaProjekta=1&bodovi=8")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Uspjesno bodovan projekat.'
            }));

            db.ClanGrupe.findAll({
                where: {
                    idGrupaProjekta: 1
                }
            }).then((clanovi) => {
                for(let i = 0; i < clanovi.length; i++) {
                    expect(clanovi[i].ostvareniBodovi).to.equal(8);
                }
                done();
            })
        });
    });
});
