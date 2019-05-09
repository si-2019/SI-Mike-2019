const db = require('../../models/db');

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
        db.Projekat.findOne({ where: { idProjekat: projekatId }})
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
    .then(() => callback(null))
    .catch(() => callback('Greska prilikom referenicranje podataka u bazi!'));
}


module.exports = {
    provjeraParametaraBodovanjeProjektneGrupe,
    upisBodovaProjektneGrupe,
    provjeraBodySpecified,
    upisBodovaProjektaPoClanu
}