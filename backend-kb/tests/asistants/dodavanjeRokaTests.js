const expect = require('chai').expect;
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const uuidv4 = require('uuid/v4');
const connection = require('../../db').connection;

describe('Testiranje post metode base/api/projects/setdeadline', () => {
    
    it('Treba da vraca gresku jer nije zadovoljen body', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/projects/setdeadline`
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Body parametri nisu specifirani [id_projekta, rok_projekta]'
            }));
            done();
        });
    });
    
    it('Treba da vrati gresku jer id_projekta nema u bazi ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/projects/setdeadline`,
            body:    encodeURI("id_projekta=15678&rok_projekta=2017-08-08 23:04:05")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Poslani id predmeta ne postoji u bazi ili je doslo do greske sa bazom!'
            }));
            done();
        });
    });
    
    it('Treba da vrati gresku jer datum nije u ispravnom formatu ', (done) => {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: `${process.env.FULL_NAME}/api/projects/setdeadline`,
            body:    encodeURI("id_projekta=1&rok_projekta=3044-01-01 24:23:75")
        }, function (error, response, body) {
            expect(body).to.equal(JSON.stringify({
                message: 'Datum nije u formatu [yyyy-mm-dd hh:mm:ss]!'
            }));
            done();
        });
    });
});