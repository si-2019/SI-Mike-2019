const connection = require('../../db').connection;

const provjeraParametaraPostPZ = (postBody) => {
    if (!postBody['naziv_projekta'] || !postBody['id_predmeta'] || !postBody['id_asistenta'] 
    || !postBody['opis_projekta'] || !postBody['moguci_bodovi']) return false;
    else return true;
}

const upisNovogProjektaUBazu = (postBody, prog, rokProjekta, callback) => {
    let novi = {
        naziv_projekta : postBody['naziv_projekta'],
        id_predmeta: postBody['id_predmeta'],
        id_asistenta: postBody['id_asistenta'],
        opis_projekta: postBody['opis_projekta'],
        moguci_bodovi: postBody['moguci_bodovi'],
        progress: prog,
        rok_projekta : rokProjekta ? rokProjekta : ''
    }
    // bude li igdje drugo >3 callbacka -> promises
    // provjeravanje da li postoji id_predmeta
    connection.query(`SELECT * FROM Predmet WHERE id=${postBody['id_predmeta']}`, (error, results1, fields) => {
        if (error) callback(true);
        let podaci = JSON.parse(JSON.stringify(results1));
        if (podaci.length !== 1) callback(true);
        else {
            // provjeravanje da li postoji id_asistenta
            connection.query(`SELECT * FROM Korisnik WHERE id=${postBody['id_asistenta']}`, (error2, results2, fields) => {
                if (error2) callback(true);
                let podaci2 = JSON.parse(JSON.stringify(results2));
                if (podaci2.length !== 1) callback(true);
                else {
                    if(!rokProjekta) rokProjekta = '';
                    let poziv = `INSERT INTO Projekat (nazivProjekta, idKorisnik, idPredmet, progress, opisProjekta, moguciBodovi, rokProjekta) VALUES ('${novi.naziv_projekta}', ${novi.id_asistenta}, ${novi.id_predmeta}, '${novi.progress}', '${novi.opis_projekta}', ${novi.moguci_bodovi}, '${rokProjekta}');`
                    // ukoliko sve postoji dodajemo projekat
                    connection.query(poziv, (err) => {
                        if (err) callback(err);
                        else callback(null, novi);
                    });
                }
            });
        }
    });
}

const provjeraParametaraRokProjekta = (postBody) => {
    let ret = {
        ispravno: true,
        poruka: ''
    };

    rokProjekta = postBody['rokProjekta'];

    if (!rokProjekta || !postBody['idProjekat']) {
        ret.poruka = 'Body parametri nisu specifirani [idProjekat, rokProjekta]';
        ret.ispravno = false;
    }
    else
    {
        let regexDatumFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])) ((0[0-9]|1[0-9]|2[0-3])\:([0-5][0-9])\:(([0-5][0-9])))/;
        if (!rokProjekta.match(regexDatumFormat)) {
            ret.poruka = 'Datum nije u formatu [yyyy-mm-dd hh:mm:ss]!';
            ret.ispravno = false;
        }
    }

    return ret;
}

const upisRokaIzradeProjekta = (postBody, callback) => {
    let deadline = postBody['rokProjekta'];
    let idProjekat = postBody['idProjekat']
    
    // provjeravanje da li postoji idProjekat
    connection.query(`SELECT * FROM Projekat WHERE idProjekat=${postBody['idProjekat']}`, (error, results1, fields) => {
        if (error) callback(true);
        let podaci = JSON.parse(JSON.stringify(results1));
        if (podaci.length !== 1) callback(true);
        else {
            let poziv = `UPDATE Projekat SET rokProjekta='${deadline}' WHERE idProjekat=${idProjekat}`;
            // dodajemo rok projekta
            connection.query(poziv, (err) => {
                if (err) callback(err);
                else callback(null);
            });
        }
    });
}

module.exports.upisNovogProjektaUBazu = upisNovogProjektaUBazu;
module.exports.provjeraParametaraPostPZ = provjeraParametaraPostPZ;
module.exports.provjeraParametaraRokProjekta = provjeraParametaraRokProjekta;
module.exports.upisRokaIzradeProjekta = upisRokaIzradeProjekta;
