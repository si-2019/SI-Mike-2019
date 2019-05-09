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

const provjeraBodySpecified = (postBody, callback) => {
    
} 

const upisBodovaProjektaPoClanu = (postBody, callback) => {

}


module.exports = {
    provjeraParametaraBodovanjeProjektneGrupe,
    upisBodovaProjektneGrupe,
    provjeraBodySpecified,
    upisBodovaProjektaPoClanu
}