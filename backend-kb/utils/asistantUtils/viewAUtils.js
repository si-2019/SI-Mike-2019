const db = require('../../models/db');

const dohvatiProjekat=(idPredmet)=>{
    return new Promise((resolve,reject)=>{
        db.Projekat.findOne({
            where:{
                idPredmet:idPredmet
            }
        }).then(rez=>{
            var json={naziv:rez.get('nazivProjekta'),opis:rez.get('opisProjekta'),bodovi:rez.get('moguciBodovi')};
            var jsonString=JSON.stringify(json);
            resolve(jsonString);
        })
    })
}

const dohvatiSvePredmeteProjekte = (callback) => {
    db.sequelize.query(`SELECT DISTINCT pr.idProjekat as id_projekta, p.naziv as naziv, pr.nazivProjekta as naziv_projekta, 
                        pr.opisProjekta as opis_projekta, pr.moguciBodovi as moguci_bodovi_na_projektu, p.id as idPredmet
                        FROM Predmet p, Projekat pr WHERE pr.idPredmet = p.id`)
    .then((niz) => {
        if(!niz || !niz[0]) callback(true);
        let array = [];
        for (let i = 0; i < niz[0].length; ++i) array.push({
            id_projekta: niz[0][i].id_projekta,
            naziv: niz[0][i].naziv,
            naziv_projekta: niz[0][i].naziv_projekta,
            opis_projekta: niz[0][i].opis_projekta,
            moguci_bodovi_na_projektu: niz[0][i].moguci_bodovi_na_projektu,
            idPredmet: niz[0][i].idPredmet
        });
        callback(null, array);
    })
    .catch(err => callback(err));
}

const dajSveProjekteStudenta = (id, callback) => {
    db.sequelize.query(`SELECT DISTINCT p.id as idPredmet, pr.idProjekat, pr.nazivProjekta as naziv, pr.opisProjekta as opis, gp.idGrupaProjekta as idProjektnaGrupa
                        FROM Predmet p, Projekat pr, ClanGrupe clan, GrupaProjekta gp
                        WHERE pr.idPredmet = p.id AND gp.idGrupaProjekta = clan.idGrupaProjekta AND gp.idProjekat = pr.idProjekat AND clan.idStudent=${id}`)
    .then((niz) => {
        if(!niz || !niz[0]) callback(true);
        let array = [];
        for (let i = 0; i < niz[0].length; ++i) array.push({ ...niz[0][i] });
        callback(null, array);
    })
    .catch(err => callback(err));
}

const dajSvePRojektneZadatkeGrupe = (id, callback) => {
    db.sequelize.query(`SELECT DISTINCT pr.idProjektnogZadatka as idProjektniZadatak, pr.opis as opis, pr.otkad as datumPocetka, pr.dokad as datumZavrsetka,
                        pr.zavrsen as zavrsen, pr.komentarAsistenta
                        FROM Projekat p, ProjektniZadatak pr, GrupaProjekta gp
                        WHERE pr.idProjekta = p.idProjekat AND gp.idProjekat = p.idProjekat AND gp.idGrupaProjekta=${id}`)
    .then((niz) => {
            if (!niz || !niz[0]) callback(true);
            let array = [];
            for (let i = 0; i < niz[0].length; ++i) array.push({
                ...niz[0][i], zavrsen : niz[0][i].zavrsen.data ? true : false
            });
            callback(null, array);
        })
        .catch(err => callback(err));
}
// {idStudent:"", ime:"", prezime:""}
const dajSveClanoveProjektne = (id, callback) => {
    db.sequelize.query(`SELECT DISTINCT clan.idStudent, k.ime, k.prezime
                        FROM GrupaProjekta gp, ClanGrupe clan, Korisnik k
                        WHERE clan.idGrupaProjekta = gp.idGrupaProjekta AND k.id = clan.idStudent AND gp.idGrupaProjekta=${id}`)
        .then((niz) => {
            if (!niz || !niz[0]) callback(true);
            let array = [];
            for (let i = 0; i < niz[0].length; ++i) array.push({
                ...niz[0][i],
            });
            callback(null, array);
        })
        .catch(err => callback(err));
}



module.exports = {
    dohvatiProjekat,
    dohvatiSvePredmeteProjekte,
    dajSveProjekteStudenta,
    dajSvePRojektneZadatkeGrupe,
    dajSveClanoveProjektne
}
