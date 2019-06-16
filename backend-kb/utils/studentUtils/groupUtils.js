const db = require('../../models/db');

const provjeraParametaraPostG = (postBody) => {
    if (!postBody['idProjekat']) return false;
    else return true;
}


const upisNoveGrupeUBazu = (postBody, callback) => {
    let novi = {
        idGrupaProjekta: postBody['idGrupaProjekta'],
        idProjekat: postBody['idProjekat'],
        nazivGrupe: postBody['nazivGrupe'],
        ostvareniBodovi: postBody['ostvareniBodovi'],
        komentarAsistenta: postBody['komentarAsistenta']
    }

    db.Projekat.findOne({
        where: {
            idProjekat: postBody['idProjekat']
        }
    }).then((projekat) => {
        //ako ne postoji projekat, vrati null
        if (!projekat) callback(null);
        else {
            db.GrupaProjekta.create(novi).then((grupa) => {
                if (!grupa) callback(null);
                else callback(grupa.idGrupaProjekta);
            })
        }
    })
}

const provjeraNovihMembera = (niz) => {
    for (let i = 0; i < niz.length; ++i)
        if (!niz[i]["idStudent"] || !niz[i]["idGrupaProjekta"]) return false;
    return true;
}

const upisNovihMemberaUBazu = (niz, callback) => {
    let filtriraniNiz = [];
    for (let i = 0; i < niz.length; ++i) {
        filtriraniNiz.push({
            idStudent: niz[i]["idStudent"],
            idGrupaProjekta: niz[i]["idGrupaProjekta"],
            kreator: niz[i]["kreator"] ? 1 : 0
        })
    }
    // provjera da li vec postoji neki member u vec postojecem timu
    // ukoliko postoji taj se korisnik remova iz filtriranog niza

    db.ClanGrupe.findAll()
        .then((sviClanovi) => {
            for (let i = 0; i < sviClanovi.length; ++i) {
                for (let j = 0; j < filtriraniNiz.length; ++j) {
                    if (sviClanovi[i].idStudent === filtriraniNiz[j].idStudent && sviClanovi[i].idGrupaProjekta === filtriraniNiz[j].idGrupaProjekta) {
                        filtriraniNiz = filtriraniNiz.splice(j, 1);
                        filtriraniNiz.length--;
                    }
                }
            }
            db.ClanGrupe.bulkCreate(filtriraniNiz, {
                    validate: true
                })
                .then((rez) => {
                    if (!rez) callback(true);
                    else callback(null);
                })
                .catch((err) => callback(err))
        })
}

const upisVodjeGrupe = (clanId, callback) => {
    db.ClanGrupe.findOne({
        where:{
            idClanGrupe:clanId
        }
    }).then((clanGrupe)=>{
        if(!clanGrupe) callback(true);
        else{
        clanGrupe.update({
            kreator:true
        })
        .then(() => { callback(null); return null; })
        .catch((err) => callback(err));
    }
    }).catch((err) => callback(err));
}

//dohvati studente - Mirza
const dohvatiStudenteProjekat=(idGrupa)=>{
    return new Promise((resolve,reject)=>{
        var json=[];
        db.Korisnik.findAndCountAll({
            where:{idUloga:1}
            //koji slusaju odabrani predmet
            //koji su u poslanoj grupi ili nisu ni na jednom projektu 
        }).then((studenti)=>{
            db.ClanGrupe.findAndCountAll({}).then((clanovi)=>{
                var duzinaStudenti=studenti.count;
                var duzinaClanovi=clanovi.count;
                for(var i=0;i<duzinaStudenti;i++){
                    var dime=studenti.rows[i].ime.toString();
                    var dprezime=studenti.rows[i].prezime.toString();
                    var id=studenti.rows[i].id.toString();
                    var clan=false;
                    if(idGrupa==0){
                        for(var j=0;j<duzinaClanovi;j++){
                            if(clanovi.rows[j].idStudent==id){
                                clan=true;
                                break;
                            }
                        }
                    }
                    else{
                        clan=true;
                        for(var j=0;j<duzinaClanovi;j++){
                            if(clanovi.rows[j].idGrupaProjekta==idGrupa && clanovi.rows[j].idStudent==id){
                                clan=false;
                                break;
                            }
                        }
                    }
                    if(!clan){
                    var objekat={ime:dime,prezime:dprezime,id:id};
                    json.push(objekat);
                    }
                }
                var jsonString=JSON.stringify(json);
                resolve(jsonString);
            });
        });
    });
}

const getStudentsProject=(id)=>{
    return new Promise((resolve,reject)=>{
        var q1= db.sequelize.query(`SELECT DISTINCT k.ime, k.prezime, k.id 
        FROM Predmet p, Projekat pr, Korisnik k, predmet_student ps 
        WHERE pr.idPredmet = p.id AND k.id = ps.idStudent AND ps.idPredmet = p.id AND p.id = ${id}`);
        
        var q2=db.sequelize.query(
            `SELECT cg.idStudent
            FROM ClanGrupe cg, Projekat pr, GrupaProjekta gp, Predmet p
            WHERE p.id=${id} and p.id=pr.idPredmet and gp.idProjekat=pr.idProjekat and cg.idGrupaProjekta=gp.idGrupaProjekta`
        );
        Promise.all([q1,q2]).then(rez=>{
            var studenti=rez[0][0];
            var clanovi=rez[1][0];
            for(var i=0;i<studenti.length;i++){
                for(var j=0;j<clanovi.length;j++){
                    if(clanovi[j].idStudent==studenti[i].id){
                        studenti.splice(i,1);
                        i--;
                        break;
                    }
                }
            }
            resolve(JSON.stringify(studenti));
        }).catch((err)=>{
            reject(err);
        })
    })
}
module.exports = {
    provjeraParametaraPostG,
    upisNoveGrupeUBazu,
    provjeraNovihMembera,
    upisNovihMemberaUBazu,
    upisVodjeGrupe,
    dohvatiStudenteProjekat,
    getStudentsProject
}