const db = require('../../models/db');
const sequelize = require('sequelize'); 

const provjeraParametaraBodovanjeProjektneGrupe = (postBody, callback) => {
    idGrupaProjekta = postBody['idGrupaProjekta'];
    bodovi = postBody['bodovi'];

    if (!bodovi || !idGrupaProjekta) {
        callback({
            ispravno: false,
            poruka: 'Body parametri nisu specifirani [idGrupaProjekta, bodovi]'
        });
    } else {
        // daj max bodova za taj projekat 
        db.GrupaProjekta.findOne({
            where: {
                idGrupaProjekta: idGrupaProjekta
            }
        }).then((grupa) => {
            if (!grupa) {
                callback({
                    ispravno: false,
                    poruka: 'Pogresan ID grupe.'
                });
            } else {
                db.Projekat.findOne({
                    where: {
                        idProjekat: grupa.idProjekat
                    }
                }).then((projekat) => {
                    if (!projekat) {
                        callback({
                            ispravno: false,
                            poruka: 'Projekat ne postoji u bazi - doslo je do greske.'
                        });
                        return;
                    }
                    max_bodova = projekat.moguciBodovi;

                    // bodovi moraju biti u intervalu [0, max]
                    if (bodovi < 0 || max_bodova && bodovi > max_bodova) {
                        callback({
                            ispravno: false,
                            poruka: 'Bodovi moraju biti u intervalu [0, max].'
                        });
                    } else {
                        callback({
                            ispravno: true
                        })
                    }
                });
            }
        });
    }
}

const upisBodovaProjektneGrupe = (postBody, callback) => {
    idGrupaProjekta = postBody['idGrupaProjekta'];
    bodovi = postBody['bodovi'];

    db.ClanGrupe.update({
            ostvareniBodovi: bodovi
        }, {
            where: {
                idGrupaProjekta: idGrupaProjekta
            }
        }).then((rez) => {
            if (!rez) callback(true);
            else callback(null);
        })
        .catch(err => {
            if (err) callback(true);
        });
};

const provjeraSvihClanova = (niz, maxB) => {
    for (let i = 0; i < niz.length; ++i) {
        let brojBodovaClana = niz[i]["ostvareniBodovi"];
        if (!niz[i]["idStudent"] || !niz[i]["idGrupaProjekta"] || !brojBodovaClana || brojBodovaClana < 0 || brojBodovaClana > maxB) return false;
    }
    return true;
}


const provjeraBodySpecified = (postBody, callback) => {
    let payload = postBody['payload'];
    let projekatId = postBody['projekat'];
    if (!projekatId || !payload) callback('Projekat/Payload parametri ispravno nisu definisani!');
    else {
        db.Projekat.findOne({
                where: {
                    idProjekat: projekatId
                }
            })
            .then((result) => {
                if (!result) callback('Poslani id projekta ne postoji u bazi!');
                else if (!provjeraSvihClanova(payload, result.moguciBodovi)) callback('Svi parametri unutar payloada za svakog studenta niza nisu specifirani (> maxbodovi?)!');
                else callback(null);
            });
    }
}

const upisBodovaProjektaPoClanu = (postBody, callback) => {
    let promises = [];
    postBody.forEach((user) => {
        promises.push(db.ClanGrupe.update({
            ostvareniBodovi: user['ostvareniBodovi']
        }, {
            where: {
                idStudent: user['idStudent'],
                idGrupaProjekta: user['idGrupaProjekta']
            }
        }));
    });
    Promise.all(promises)
        .then((rez) => callback(null))
        .catch(() => callback('Greska prilikom referenicranje podataka u bazi!'));
}

const provjeraSvakogProjektnog = (niz) => {
    if (!niz) return false;
    for (let i = 0; i < niz.length; ++i)
        if (!niz[i].idProjektniZadatak || !niz[i].komentarAsistenta || !niz[i].ostvareniBodovi ||
            !niz[i].idProjekat) return false;
    return true;
}

// mozda iskoci error node:12724, zanemariti glupost :)
const bodovanjeProjektnogZadatka = (nizVrijednosti, callback) => {
    // definisanje stringa da zadovoljava IN (..)
    let string = "";
    for (let i = 0; i < nizVrijednosti.length; ++i) string += nizVrijednosti[i].idProjektniZadatak.toString() + ',';
    string = string.substring(0, string.length - 1);
    db.sequelize.query(`SELECT DISTINCT p.idProjekat, p.moguciBodovi, pz.idProjektnogZadatka, pz.idProjekta, c.ostvareniBodovi, c.idClanGrupe 
                        FROM Projekat p, ProjektniZadatak pz, ClanGrupe c, GrupaProjekta gp, projektniZadatak_clanGrupe veza 
                        WHERE pz.idProjekta = p.idProjekat AND veza.idProjektniZadatak = pz.idProjektnogZadatka AND
                        veza.idClanGrupe = c.idClanGrupe AND c.idGrupaProjekta = gp.idGrupaProjekta AND
                        pz.idProjektnogZadatka IN (${string})`, { type: sequelize.QueryTypes.SELECT })
        .then((podaci) => {
            // console.log('podaciPotrebni', nizVrijednosti);
            // console.log('podaci', podaci);
            // console.log('string', string);
            let promisi = [];

            for (let i = 0; i < nizVrijednosti.length; ++i) {
                for (let j = 0; j < podaci.length; ++j) {
                    if (nizVrijednosti[i].idProjektniZadatak === podaci[j].idProjektnogZadatka && nizVrijednosti[i].idProjekat == podaci[j].idProjekat) {
                        // updateovanje za svaki projektni zadatak sve info u bazi
                        // provjeravanje jel preslo max definisanih bodova, ukoliko jest
                        // ne dodaju se bodovi vec se uzima min {novih, starih}
                        let brojB = (nizVrijednosti[i].ostvareniBodovi + podaci[j].ostvareniBodovi) < podaci[j].moguciBodovi ? nizVrijednosti[i].ostvareniBodovi + podaci[j].ostvareniBodovi : podaci[j].ostvareniBodovi;
                        promisi.push(db.ClanGrupe.update({
                            ostvareniBodovi: brojB,
                        }, { where: { idClanGrupe : podaci[j].idClanGrupe }}));
                        promisi.push(db.ProjektniZadatak.update({
                            komentarAsistenta: nizVrijednosti[i].komentarAsistenta,
                            zavrsen: true
                        }, { where: { idProjektnogZadatka : nizVrijednosti[i].idProjektniZadatak }}));
                    }
                }
            }
            if(!promisi.length) callback('Nijedan projektni zadatak ne postoji u bazi/nije bodovan.');
            else Promise.all(promisi)
                .then((rez) => { callback(null); return null; })
                .catch((err) => callback('Greska prilikom referenicranje podataka u bazi!', err));
        })
        .catch((err) => callback('Greska prilikom referenicranje podataka u bazi!', err));
}

module.exports = {
    provjeraParametaraBodovanjeProjektneGrupe,
    upisBodovaProjektneGrupe,
    provjeraBodySpecified,
    upisBodovaProjektaPoClanu,
    provjeraSvakogProjektnog,
    bodovanjeProjektnogZadatka
}