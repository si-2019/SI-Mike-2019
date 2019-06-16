const db = require('../../models/db');
const sequelize = require('sequelize');

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
                            }).catch((err) => reject(true));;
                    }).catch((err) => reject(true));
            }).catch((err) => reject(true));
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
        }).catch((err) => callback(err));;
}

const sveProvjereZaPredmeteAsistenta = (idAsistenta, callback) => {
    // provjera da li je taj asistent zapravo asistent je na tom predmetu?
    db.Predmet.findAll({ where: { idAsistent : idAsistenta}})
    .then((predmeti) => {
        if(!predmeti.length) callback(true);
        else {
            // filtriranje svih projekata koji sadrze neki projekat i da je asistent na tim projektima i da nema kreiranih grupa
            db.sequelize.query(`SELECT DISTINCT p.naziv, pr.idProjekat, Count(ps.id)  as brojStudenata
            FROM Predmet p, Projekat pr, predmet_student ps 
            WHERE ps.idPredmet = p.id and pr.idPredmet = p.id and p.idAsistent = ${idAsistenta}
            GROUP BY p.naziv, pr.idProjekat`, { type: sequelize.QueryTypes.SELECT })
            .then((niz) => {
                let nizIdProjekata = [];
                for(let i = 0; i < niz.length; ++i) nizIdProjekata.push(niz[i].idProjekat);  
                db.GrupaProjekta.findAll({ where: { idProjekat : nizIdProjekata }})
                .then((nizGrupa) => {   
                    if(!nizGrupa.length) callback(null, niz);
                    else {
                        // izbaciti one koji imaju kreiranu barem 1 grupu
                        for (let i = 0; i < nizGrupa.length; ++i) {
                            for (let j = 0; j < nizIdProjekata.length; ++j) {
                                if (nizGrupa[i].idProjekat === nizIdProjekata[j]) {
                                    niz.splice(j, 1);
                                    nizIdProjekata.splice(j, 1);
                                }
                            }
                        }
                        callback(null, niz);
                    }
                    return null;
                })
                .catch((err) => { console.log(err); callback(err)});  
                return null;     
            })
            .catch((err) => {console.log(err); callback(err)});
        }
    }).catch((err) => callback(err));
}

const dobaviProjektneGrupe = (idProjekat, callback) => {
    db.GrupaProjekta.findAll({ where: { idProjekat }})
    .then((grupeProjekta) => { 
        callback(null, grupeProjekta);
        return null;
    })
    .catch((err) => callback(err));
}

const dohvatiPredmete=(idAsistent, callback)=>{
    db.Predmet.findAll({ where: { idAsistent : idAsistent}})
    .then((predmeti) => {
        if(!predmeti.length) callback(true);
        else {
            db.Projekat.findAll().then(projekti=>{
                for(var j=0;j<predmeti.length;j++)
                for(var i=0;i<projekti.length;i++){
                    if(projekti[i].idPredmet==predmeti[j].id){ 
                        predmeti.splice(j,1);
                        j--;
                        break;
                    }
                }
                callback(null,predmeti);
            })
        }
    }).catch((err) => callback(err));;
}


module.exports = {
    upisNovogProjektaUBazu,
    provjeraParametaraPostPZ,
    provjeraParametaraRokProjekta,
    upisRokaIzradeProjekta,
    sveProvjereZaPredmeteAsistenta,
    dobaviProjektneGrupe,
    dohvatiPredmete
}