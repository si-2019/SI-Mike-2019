import db from '../../models/db';

const provjeraParametaraPostPZ = (postBody) => {
    if (!postBody['naziv_projekta'] || !postBody['id_predmeta'] || !postBody['id_asistenta'] ||
        !postBody['opis_projekta'] || !postBody['moguci_bodovi']) return false;
    else return true;
}

const upisNovogProjektaUBazu = (postBody, prog, rokProjekta, callback) => {
    let novi = {
        nazivProjekta: postBody['naziv_projekta'],
        idPredmet: postBody['id_predmeta'],
        idKorisnik: postBody['id_asistenta'],
        opisProjekta: postBody['opis_projekta'],
        moguciBodovi: postBody['moguci_bodovi'],
        progress: prog,
        rokProjekta: rokProjekta ? rokProjekta : ''
    }
    // provjeravanje da li postoji id_predmeta
    db.Predmet.findOne({
            where: {
                id: postBody['id_predmeta']
            }
        })
        .then((predmet) => {
            if (!predmet) callback(true);
            else {
                // provjeravanje da li postoji id_asistenta
                db.Korisnik.findOne({
                    where: {
                        id: postBody['id_asistenta']
                    }
                }).then((asistent) => {
                    if (!asistent) callback(true);
                    else {
                        db.Projekat.create(novi)
                            .then((projekat) => {
                                if (!projekat) callback(true);
                                else callback(null, projekat);
                            })
                    }
                });
            }
        })
}

const provjeraParametaraRokProjekta = (postBody) => {
    let ret = {
        ispravno: true,
        poruka: ''
    };

    let rokProjekta = postBody['rokProjekta'];

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

export default {
    upisNovogProjektaUBazu,
    provjeraParametaraPostPZ,
    provjeraParametaraRokProjekta,
    upisRokaIzradeProjekta
};