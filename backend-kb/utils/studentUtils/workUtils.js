const db = require('../../models/db');

const provjeraParametaraPostPZ = (postBody) => {
    if (!postBody['id_projekta'] || !postBody['od_kad'] || !postBody['do_kad']) return false;
    else return true;
}


const upisNovogPZuBazu = (postBody, opis, zavrsen, komentar_a, callback) => {
    let novi = {
        idProjekta: postBody['id_projekta'],
        opis,
        otkad: postBody['od_kad'],
        dokad: postBody['do_kad'],
        zavrsen,
        komentarAsistenta: komentar_a
    }
    db.Projekat.findOne({
        where: {
            idProjekat: postBody['id_projekta']
        }
    }).then((projekat) => {
        if (!projekat) callback(true);
        else {
            db.ProjektniZadatak.create(novi)
                .then((kreiran) => {
                    if (!kreiran) callback(err);
                    else callback(null, kreiran);
                })
        }
    });
}

const provjeraParametaraAssignTask = (body) => {
    if(!body.idVodje || !body.zadaci) return false;
    for(let i=0; i < body.zadaci.length; ++i) if(!body.zadaci[i].idClanGrupe || !body.zadaci[i].idProjektniZadatak) return false;
    return true;
}

const provjeraVodjeIClanova = (body, callback) => {
    db.ClanGrupe.findOne({ where: { idClanGrupe : body.idVodje }})
    .then((vodja) => {
        if(!vodja.kreator) callback('Vodja nije kreator!')
        else {
            let nizClanovaId = [];
            body.zadaci.forEach(element => nizClanovaId.push(element.idClanGrupe));
            db.ClanGrupe.findAll({ where: { idClanGrupe : nizClanovaId }})
            .then((sviClanovi) => {
               let bool = true;
               for(let i = 0; i < sviClanovi.length; ++i) if(sviClanovi[i].idGrupaProjekta !== vodja.idGrupaProjekta) { bool = false; break; }
               if(!bool) callback('Svi clanovi nisu u istoj grupi gdje je i vođa!');
               else callback(null);
               return null;
            })
        }
    })

}

const odradiPostavljanjeZadataka = (niz, callback) => {
    let promisi = [];
    niz.forEach(element => promisi.push(db.ProjektniZadatak_ClanGrupe.create({
        idProjektniZadatak : element.idProjektniZadatak,
        idClanGrupe : element.idClanGrupe,
    }))); 
    Promise.all(promisi)
        .then((rez) => {
            callback(null);
            return null;
        })
        .catch((err) => callback('Greska prilikom referenicranje podataka u bazi!', err));
}

module.exports = {
    provjeraParametaraPostPZ,
    upisNovogPZuBazu,
    provjeraParametaraAssignTask,
    provjeraVodjeIClanova,
    odradiPostavljanjeZadataka
}