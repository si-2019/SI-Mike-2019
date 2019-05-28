const db = require('../../models/db');
const multer  = require('multer');

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

//

const provjeraParametaraUploadFajla = (postBody, cb) => {
    let idZadatka = postBody['idProjektnogZadatka'];

    if(!idZadatka) {
        cb ({
            ispravno: false,
            poruka: 'Body parametri nisu specifirani: idProjektnogZadatka.'
        });
    }
    else {
        db.ProjektniZadatak.findOne({
            where: {
                idProjektnogZadatka: idZadatka
            }
        }).then((zad) => {
            if(!zad) {
                cb ({
                    ispravno: false,
                    poruka: 'Ne postoji dati projektni zadatak.'
                });
            }
            else {
                cb ({
                    ispravno: true
                });
            }
        })
    }
}

const noviID = () => {
    return Math.random().toString(36).substr(2, 9);
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) 
    {
        cb(null, __dirname + '../../../temp_files/')
    },
    filename: function (req, file, cb) 
    {
        let ext = '';
        // ako ima ekstenzije
        if (file.originalname.split('.').length > 1) {
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        }
        
        cb(null, file.originalname + noviID());
    }
})

const upload = multer({dest: __dirname + '../../../temp_files/', storage: storage});

const spremiFajl = (idFajla) => {

}

const obrisiTempFajl = (id) => {
    
}

module.exports = {
    provjeraParametaraPostPZ,
    upisNovogPZuBazu,
    provjeraParametaraAssignTask,
    provjeraVodjeIClanova,
    odradiPostavljanjeZadataka,
    upload,
    noviID,
    provjeraParametaraUploadFajla,
    obrisiTempFajl
}