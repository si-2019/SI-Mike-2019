const db = require('../../models/db');

const provjeraParametaraPostG = (postBody) => {
    if (!postBody['idGrupaProjekta'] || !postBody['idProjekat']) return false;
    else return true;
}


const upisNoveGrupeUBazu = (postBody, callback) => {
    let novi = {
        idGrupaProjekta: postBody['idGrupaProjekta'],
        idProjekat: postBody['idProjekat'],
        nazivGrupe: postBody['nazivGrupe'],
        ostvareniBodovi: postBody['ostvareniBodovi'],
        komentarAsistenta: postBody['komentarAsistenta']
    }

    db.Projekat.findOne({
        where: {
            id: postBody['idProjekat']
        }
    }).then((projekat) => {
        //ako ne postoji projekat, vrati true
        if (!projekat) callback(true);
        else {
            db.GrupaProjekta.create(novi).then((grupa) => {
                if (!grupa) callback(true);
                else callback(null, grupa);
            })
        }
    })
}

const provjeraNovihMembera = (niz) => {
    for (let i = 0; i < niz.length; ++i)
        if (!niz[i]["idStudent"] || !niz[i]["idGrupaProjekta"]) return false;
    return true;
}

const upisNovihMemberaUBazu = (niz, callback) => {
    let filtriraniNiz = [];
    for (let i = 0; i < niz.length; ++i) {
        filtriraniNiz.push({
            idStudent: niz[i]["idStudent"],
            idGrupaProjekta: niz[i]["idGrupaProjekta"],
            kreator: niz[i]["kreator"] ? 1 : 0
        })
    }
    // provjera da li vec postoji neki member u vec postojecem timu
    // ukoliko postoji taj se korisnik remova iz filtriranog niza

    db.ClanGrupe.findAll()
        .then((sviClanovi) => {
            for (let i = 0; i < sviClanovi.length; ++i) {
                for (let j = 0; j < filtriraniNiz.length; ++j) {
                    if (sviClanovi[i].idStudent === filtriraniNiz[j].idStudent && sviClanovi[i].idGrupaProjekta === filtriraniNiz[j].idGrupaProjekta) {
                        filtriraniNiz = filtriraniNiz.splice(j, 1);
                        filtriraniNiz.length--;
                    }
                }
            }
            db.ClanGrupe.bulkCreate(filtriraniNiz, {
                    validate: true
                })
                .then((rez) => {
                    if (!rez) callback(true);
                    else callback(null);
                })
                .catch((err) => callback(err))
        })
}

const upisVodjeGrupe = (clanId, callback) => {
    db.ClanGrupe.findOne({
        where:{
            idClanGrupe:clanId
        }
    }).then((clanGrupe)=>{
        if(!clanGrupe) callback(true);
        else{
        clanGrupe.update({
            kreator:true
        }).success(callback(null));
    }
    });
}

module.exports = {
    provjeraParametaraPostG,
    upisNoveGrupeUBazu,
    provjeraNovihMembera,
    upisNovihMemberaUBazu,
    upisVodjeGrupe
}