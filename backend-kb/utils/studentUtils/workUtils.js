const connection = require('../../db').connection;

const provjeraParametaraPostPZ = (postBody) => {
    if (!postBody['id_projekta'] || !postBody['od_kad'] || !postBody['do_kad']) return false;
    else return true;
}


const upisNovogPZuBazu = (postBody, opis, zavrsen, komentar_a, callback) => {
    let novi = {
        id_projekta: postBody['id_projekta'],
        opis,
        od_kad: postBody['od_kad'],
        do_kad: postBody['do_kad'],
        zavrsen,
        komentar_asistenta: komentar_a
    }
     connection.query(`SELECT * FROM Projekat WHERE idProjekat=${postBody['id_projekta']}`, (error, results1, fields) => {
        if (error) callback(true);
        let podaci = JSON.parse(JSON.stringify(results1));
        if (podaci.length !== 1) callback(true);
        else {
            let poziv = `INSERT INTO ProjektniZadatak (idProjekta, opis, otkad, dokad, zavrsen, komentarAsistenta) VALUES (${novi.id_projekta}, '${novi.opis}', '${novi.od_kad}', '${novi.do_kad}', ${novi.zavrsen}, '${novi.komentar_asistenta}');`
            // ukoliko postoji taj projekat dodajemo novi projektni zadatak
             connection.query(poziv, (err) => {
                if(err) callback(err);   
                else callback(null, novi);
        });
        }
    });
}

module.exports.provjeraParametaraPostPZ = provjeraParametaraPostPZ;
module.exports.upisNovogPZuBazu = upisNovogPZuBazu;