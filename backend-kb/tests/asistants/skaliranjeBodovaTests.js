const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const db = require('../../models/db');

describe('Testiranje post metode base/services/bodovanjeprojekata/scaling', () => {

    it('Treba da vraca gresku jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/scaling`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani [idProjekat, faktorSkaliranja]'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer idProjekat ne postoji u bazi ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/scaling`,
            body: encodeURI("idProjekat=15678&faktorSkaliranja=1")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Dati projekat ne postoji.'
            }));
            done();
        });
    });

    it('Treba da vrati gresku jer je faktor skaliranja manji od nule', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/scaling`,
            body: encodeURI("idProjekat=29&faktorSkaliranja=-1")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Faktor skaliranja mora biti veci ili jednak nula.'
            }));
            done();
        });
    });

    it('Treba da ispravno izvrsi promjenu bodova projekta u bazi za sve clanove grupa na projektu', (done) => {
        db.ClanGrupe.findOne({
            where: {
                idClanGrupe: 57
            }
        }).then((clan) => {
            let stariBodovi = clan.ostvareniBodovi;
            let faktorSkaliranja = 0.5;
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                url: `${process.env.FULL_NAME}/services/bodovanjeprojekata/scaling`,
                body: encodeURI(`idProjekat=29&faktorSkaliranja=${faktorSkaliranja}`)
            }, function (error, response, body) {
                expect(body).to.equal(JSON.stringify({
                    message: 'Uspjesno skalirani bodovi.'
                }));
    
                db.ClanGrupe.findOne({
                    where: {
                        idClanGrupe: 57
                    }
                }).then((clan) => {
                    let ocekivaniBodovi = Math.floor((stariBodovi * faktorSkaliranja + 0.005) * 100) / 100;

                    expect(clan.ostvareniBodovi).to.equal(ocekivaniBodovi);
                    done();
                })
            });
        })
    });
});
