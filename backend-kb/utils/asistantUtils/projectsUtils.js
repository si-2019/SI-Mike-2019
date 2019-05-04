const db = require('../../models/db');

const provjeraParametaraPostPZ = (postBody) => {
    if (!postBody['naziv_projekta'] || !postBody['id_predmeta'] || !postBody['id_asistenta'] ||
        !postBody['opis_projekta'] || !postBody['moguci_bodovi']) return false;
    else return true;
}

const upisNovogProjektaUBazu = (postBody, prog, rokProjekta) => {
    let novi = {
        nazivProjekta: postBody['naziv_projekta'],
        idPredmet: postBody['id_predmeta'],
        idKorisnik: postBody['id_asistenta'],
        opisProjekta: postBody['opis_projekta'],
        moguciBodovi: postBody['moguci_bodovi'],
        progress: prog ? prog : 0.000,
        rokProjekta: rokProjekta ? rokProjekta : ''
    }
    // provjeravanje da li postoji id_predmeta
    return new Promise((resolve, reject) => {
        db.Predmet.findOne({
                where: {
                    id: postBody['id_predmeta']
                }
            })
            .then((predmet) => {
                if (!predmet) reject(true);
                // provjeravanje da li postoji id_asistenta
                else db.Korisnik.findOne({
                        where: {
                            id: postBody['id_asistenta']
                        }
                    })
                    .then((asistent) => {
                        if (!asistent) reject(true);
                        else db.Projekat.create(novi)
                            .then((projekat) => {
                                if (!projekat) reject(true);
                                else resolve(projekat);
                            });
                    })
            })
    })
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
    } else {
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
    db.Projekat.findOne({
            where: {
                idProjekat
            }
        })
        .then((projekat) => {
            if (!projekat) callback(true);
            else {
                db.Projekat.update({
                        rokProjekta: deadline
                    }, {
                        where: {
                            idProjekat
                        }
                    })
                    .then((rez) => {
                        if (!rez) callback(true);
                        else callback(null);
                    })
            }
        });
}

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

module.exports = {
    upisNovogProjektaUBazu,
    provjeraParametaraPostPZ,
    provjeraParametaraRokProjekta,
    upisRokaIzradeProjekta,
    provjeraParametaraBodovanjeProjektneGrupe,
    upisBodovaProjektneGrupe
}