const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

describe('Testiranje post metode base/api/work', () => {

    it('Treba da vraca specifican json jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani [id_projekta, prioritet, od_kad, do_kad]'
            }));
            done();
        });
    });

    it('Treba da vraca jer je zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/work`,
            body:    "id_projekta=1&prioritet=0.2&od_kad=danas&do_kad=sutra"
        }, function (error, response, body) {
            let novi = JSON.parse(body);
            expect(novi.id_projekta).to.equal('1');
            expect(novi.prioritet).to.equal('0.2');
            expect(novi.od_kad).to.equal('danas');
            expect(novi.do_kad).to.equal('sutra');
            done();
        });
    });

    it('Treba da unese u bazu novi projektni zadatak', (done) => {    
        // fali 1 test za testiranje jel se dodaju u bazu
        // bice kad se vođe dogovore !
        expect(true).to.equal(true);
        done();
    });

});