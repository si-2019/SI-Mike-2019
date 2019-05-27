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
        if(!vodja) callback('Ne postoji poslani vodja!');
        else if(!vodja.kreator) callback('Vodja nije kreator!')
        else {
            let nizClanovaId = [];
            let nizPz = [];
            body.zadaci.forEach(element => { nizClanovaId.push(element.idClanGrupe); nizPz.push(element.idProjektniZadatak); });
            db.ProjektniZadatak.findAll({ where: { idProjektnogZadatka : nizPz }})
            .then((rezultat) => {
                if(rezultat.length !== nizPz.length) callback('Ne postoje svi projektni zadaci u bazi!');
                else {
                    db.GrupaProjekta.findOne({ where: { idGrupaProjekta : vodja.idGrupaProjekta }})
                    .then((grupaProjekta) => {
                        if(!grupaProjekta) callback('Ne postoji grupa projekta za poslanog vodju!');
                        else {
                            let provjeraPzidProjekta = true;
                            for(let i = 0; i < rezultat.length; ++i) if(rezultat[i].idProjekta !== grupaProjekta.idProjekat) { provjeraPzidProjekta = false; break; }
                            if(!provjeraPzidProjekta) callback('Projektni zadaci se ne slazu se projektom!');
                            else db.ClanGrupe.findAll({ where: { idClanGrupe : nizClanovaId }})
                                .then((sviClanovi) => {
                                    if(sviClanovi.length !== nizClanovaId.length) callback('Ne postoje svi clanovi u bazi!');
                                    else {
                                        let bool = true;
                                        for(let i = 0; i < sviClanovi.length; ++i) if(sviClanovi[i].idGrupaProjekta !== vodja.idGrupaProjekta) { bool = false; break; }
                                        if(!bool) callback('Svi clanovi nisu u istoj grupi gdje je i vođa!');
                                        else callback(null);
                                        return null;
                                }})
                        }
                    })
                }
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