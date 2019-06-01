const sequelize = require('sequelize');
const db = require('../../models/db');

const dajSveProjekte = (id, callback) => {
    db.Projekat.findAll({ where: { idPredmet : id }})
        .then((rez) => {
            if(!rez) callback(true);
            else callback(null, rez);
            return null;
        })
        .catch((err) => callback(err))
}

const dajSveProjekteUsera = (idStudenta) => {
    return db.sequelize.query(`SELECT DISTINCT projekat.idProjekat, projekat.nazivProjekta, projekat.opisProjekta, predmet.naziv
                        FROM Projekat projekat, Predmet predmet, Korisnik korisnik, GrupaProjekta gp, ClanGrupe cg
                        WHERE projekat.idPredmet=predmet.id AND gp.idProjekat=projekat.idProjekat AND
                        korisnik.id=cg.idStudent AND cg.idGrupaProjekta=gp.idGrupaProjekta AND korisnik.id=${idStudenta}`, {type:sequelize.QueryTypes.SELECT});
}

const dajSveZadatkeProjekta = (idProjekta) => {
    return db.ProjektniZadatak.findAll({
        where: {
            idProjekta: idProjekta
        }
    });
}

const dajSvePredmete = () => { return db.Predmet.findAll(); }

// svi projekti na predmetu, za koje dati student nije niti u jednoj grupi u ovoj akademskoj godini
const dajProjekteKreiranjeGrupe = (idStudenta, idPredmeta) => {
    return db.sequelize.query(`SELECT DISTINCT projekat.idProjekat, projekat.nazivProjekta, projekat.progress, projekat.opisProjekta,
                                        projekat.moguciBodovi, projekat.rokProjekta
                            FROM Projekat projekat, Korisnik korisnik, predmet_student ps, AkademskaGodina ag
                            WHERE projekat.idPredmet=${idPredmeta} AND korisnik.id=${idStudenta} AND ps.idStudent=korisnik.id AND 
                            ps.idPredmet=${idPredmeta} AND ps.idAkademskaGodina=ag.id AND ag.aktuelna='1' AND korisnik.id NOT IN (
                                SELECT k2.id
                                FROM Korisnik k2, GrupaProjekta gp, ClanGrupe cg
                                WHERE k2.id=cg.idStudent AND gp.idGrupaProjekta=cg.idGrupaProjekta AND gp.idProjekat=projekat.idProjekat
                            )`, {type:sequelize.QueryTypes.SELECT});
}
 
const zaSvakiPredmetPopuniProjektneZadatke = (niz, callback) => {
    let nizIdeva = [];
    for(let i = 0; i < niz.length; ++i) nizIdeva.push(niz[i].id); 
    db.ProjektniZadatak.findAll({ where: { idProjekta : nizIdeva} })
      .then((rez) => {
          for(let i=0; i< niz.length; ++i){
              niz[i].zadaci = [];
              niz[i].zadaci = rez.filter(rez => rez.idProjekta === niz[i].id);
          }
        callback(null, niz);
    })
    .catch(err => callback(err));
}

const dajSveProjekteProjektneZadatke = (callback) => {
    db.Projekat.findAll()
    .then((projekti) => {
        let string = "";
        for (let i = 0; i < projekti.length; ++i) { projekti[i].dataValues.projektniZadaci = []; string += projekti[i].idProjekat.toString() + ','; }
        string = string.substring(0, string.length - 1);
        db.sequelize.query(`SELECT DISTINCT pz.idProjektnogZadatka, pz.idProjekta, pz.opis, pz.otkad, pz.dokad, pz.zavrsen, pz.komentarAsistenta
                        FROM Projekat p, ProjektniZadatak pz WHERE pz.idProjekta = p.idProjekat AND pz.idProjekta IN (${string})`, { type: sequelize.QueryTypes.SELECT })
        .then((projektniZadaci) => {
            for (let j = 0; j < projektniZadaci.length; ++j) {
                for (let i = 0; i < projekti.length; ++i) {
                    if (projekti[i].idProjekat === projektniZadaci[j].idProjekta) {
                        const buf = Buffer.from(JSON.stringify(projektniZadaci[j].zavrsen));
                        const objekat = JSON.parse(buf.toString());
                        projektniZadaci[j].zavrsen = objekat.data[0] ? true : false;
                        projekti[i].dataValues.projektniZadaci.push(JSON.parse(JSON.stringify(projektniZadaci[j])));
                    }
                }
            }
            callback(null, projekti);
            return null;
        })
        .catch((err) => { console.log(err); callback(err)});
        return null;
    })
    .catch((err) => callback(err));
}

module.exports = {
    dajSveProjekte,
    zaSvakiPredmetPopuniProjektneZadatke,
    dajSvePredmete,
    dajSveProjekteUsera,
    dajSveZadatkeProjekta,
    dajProjekteKreiranjeGrupe,
    dajSveProjekteProjektneZadatke
};