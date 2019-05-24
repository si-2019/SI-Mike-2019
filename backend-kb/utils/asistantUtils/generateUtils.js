const sequelize = require('sequelize');
const db = require('../../models/db');

const provjeraParametaraGenerisanjeGrupe = (postBody, callback) => {
    idProjekta = postBody['idProjekat'];
    brojGrupa = postBody['brojGrupa'];

    if(!idProjekta || !brojGrupa) {
        callback({
            ispravno: false,
            poruka: 'Body parametri nisu specifirani [idProjekat, brojGrupa]'
        });
    }
    else if(brojGrupa < 1) {
        callback({
            ispravno: false,
            poruka: 'Broj grupa mora biti veci ili jednak 1.'
        });
    }
    else {
        db.Projekat.findOne({
            where: {
                idProjekat: idProjekta
            }
        }).then((projekat) => {
            if(!projekat) {
                callback({
                    ispravno: false,
                    poruka: 'Poslani ID projekta ne postoji.'
                });
            } else {
                callback({
                    ispravno: true
                })
            }
        });
    }
}

const upisGrupaNasumicno = (postBody, callback) => {
    idProjekta = postBody['idProjekat'];
    brojGrupa = postBody['brojGrupa'];

    db.sequelize.query(`SELECT DISTINCT korisnik.id, korisnik.ime, korisnik.prezime 
                        FROM Korisnik korisnik, Predmet predmet, Projekat projekat, AkademskaGodina ag, predmet_student ps 
                        WHERE korisnik.id=ps.idStudent AND predmet.id=ps.idPredmet AND projekat.idProjekat=${idProjekta} 
                        AND projekat.idPredmet=predmet.id AND ps.idAkademskaGodina=ag.id AND ag.aktuelna='1'`, 
                        {type:sequelize.QueryTypes.SELECT}).then((studenti) => {
    
        if(!studenti || studenti.length < 1) callback(true);
        else {
            studenti.sort((prvi, drugi) => {
                prvi.prezime > drugi.prezime ? 1 : (
                    (drugi.prezime > prvi.prezime) ? -1 : (
                        prvi.ime > drugi.ime ? 1 : (
                            drugi.ime > prvi.ime ? -1 : 0
                        )
                    ))
            }); 

            let base = Math.floor(studenti.length / brojGrupa);
            if(base < 1) {
                callback(true);
                return;
            }
            let greska = false;
            let kolikoDodatnih = studenti.length - base * brojGrupa;

            let brojDodanihGrupa = 0;
            for(let i = 0; i < brojGrupa; i++) {
                new function() {
                    var i_closure = i;

                    db.GrupaProjekta.create({
                        idProjekat: idProjekta,
                        nazivGrupe: `Grupa ${i_closure + 1}`
                    }).then((grupa) => {
                        if(!grupa) {
                            if(!greska) callback(true);
                            greska = true;
                            return;
                        }

                        let vel = (kolikoDodatnih > i_closure) ? (base + 1) : base;

                        let odakle = i_closure * vel;
                        let studenti_grupe = studenti.slice(odakle, odakle + vel);
                        brojDodanihStudenata = 0;
                        for(let k = 0; k < vel; k++) {
                            new function() {
                                var k_closure = k;
                                var studenti_grupe_c = studenti_grupe;
                                
                                db.ClanGrupe.create({
                                    idStudent: studenti_grupe_c[k_closure].id,
                                    idGrupaProjekta: grupa.idGrupaProjekta
                                }).then((clan) => {
                                    brojDodanihStudenata++;
                                    if(brojDodanihStudenata >= vel) brojDodanihGrupa++;
                                    if(brojDodanihGrupa >= brojGrupa) callback(null);
                                }).catch((err) => {
                                    if(err) {
                                        if(!greska) callback(true);
                                        greska = true;
                                    }
                                });
                            }();
                        }
                    });
                }();
            } 
        }     
    });
}

module.exports = {
    provjeraParametaraGenerisanjeGrupe,
    upisGrupaNasumicno
}