const db = require('../../models/db');
const multer  = require('multer');
const fs = require('fs');

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
        }).catch((err) => {
            cb({
                ispravno: false,
                poruka: 'Doslo je do greske sa bazom'
            });
        })
    }
}

const duzinaID = 10;
const noviID = () => {
    return Math.random().toString(36).substr(2, duzinaID);
}

const fileFilter = (req, file, callback) => {
    provjeraParametaraUploadFajla(req.body, (cb) => {
        callback(null, cb.ispravno);
    }); 
}

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) 
        {
            let path = __dirname + `../../../temp_files/${noviID()}/`;
            fs.mkdir(path, (err) => {
                if(!err) cb(null, path);
                else console.log(`Error pri kreiranju foldera: ${err}`);
            });
        },
        filename: function (req, file, cb) 
        {
            cb(null, file.originalname);
        }
    }),
    fileFilter: fileFilter
});

const dajIDizDestinacije = (dest) => {
    return dest.substr(dest.length - duzinaID - 1, duzinaID);
}

const spremiFajlUBazu = (fajl, idProjektniZadatak) => {
    let path = __dirname + `../../../temp_files/${dajIDizDestinacije(fajl.destination)}`;

    fs.readFile(path + '/' + fajl.originalname, (err, data) => {
        if(!err) {
            let noviProjektniFajl = {
                idProjektniZadatak: idProjektniZadatak,
                file: data,
                file_size: fajl.size,
                file_type: fajl.mimetype,
                nazivFile: fajl.originalname
            };

            obrisiTempFajl(fajl, (err) => {
                if(err) {
                    console.log("Doslo je do greske prilikom brisanja temp fajla.");
                }
            });

            if(fajl.size > 16777000) {
                throw "Fajlovi ne smiju biti veci od 16MB.";
            }

            return db.ProjektniFile.create(noviProjektniFajl);
        }
        else {
            throw "Greska pri citanju temp fajla.";
        }
    });   
}

const obrisiTempFajl = (fajl, cb) => {
    let path = __dirname + `../../../temp_files/${dajIDizDestinacije(fajl.destination)}`;
    fs.unlink(`${path}/${fajl.originalname}`, (err) => {
        if(!err) {
            fs.rmdir(path, (err) => {
                if(!err) {
                    cb(null);
                }
                else {
                    cb(true);
                }
            });
        }
        else {
            cb(true);
        }
    });
}

const dajFajlIzBaze = (idProjektnogFajla) => {
    return db.ProjektniFile.findOne({
        where: {
            idProjektniFile: idProjektnogFajla
        }
    });
}

module.exports = {
    provjeraParametaraPostPZ,
    upisNovogPZuBazu,
    provjeraParametaraAssignTask,
    provjeraVodjeIClanova,
    odradiPostavljanjeZadataka,
    upload,
    provjeraParametaraUploadFajla,
    spremiFajlUBazu,
    dajFajlIzBaze
}