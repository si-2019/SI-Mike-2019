const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

const uuidv4 = require('uuid/v4');
const db = require('../../models/db');

describe('Testiranje post metode base/services/group/selectleader', () => {

    it('Treba da postavi studenta za vodju grupe', (done) => {
        let testni = {
            idClanGrupe: 100,
            idStudent: 5,
            idGrupaProjekta: 1,
            ostvareniBodovi: 10,
            kreator: null
        }
        db.ClanGrupe.findOrCreate({ where: { idClanGrupe : testni.idClanGrupe}, defaults : testni },)
        .then(() => {
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                url: `${process.env.FULL_NAME}/services/group/selectleader`,
                body: encodeURI(`id=100`)
            }, function (error, response, body) {
                db.ClanGrupe.findOne({
                    where: {
                        idClanGrupe: 100
                    }
                }).then((rez) => {
                    expect(rez.kreator).to.equal(true);
                    done();
                });
            })
        })
        .catch((err) => console.log(err));
    }); 
});