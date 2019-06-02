const db = require('../../models/db');

const dohvatiProjekat=(idPredmet)=>{
    console.log(idPredmet);
    return new Promise((resolve,reject)=>{
        db.Projekat.findOne({
            where:{
                idPredmet:idPredmet
            }
        }).then(rez=>{
            var json={naziv:rez.get('nazivProjekta'),opis:rez.get('opisProjekta'),bodovi:rez.get('moguciBodovi')};
            var jsonString=JSON.stringify(json);
            resolve(jsonString);
        })
    })
}

module.exports = {
    dohvatiProjekat
}
