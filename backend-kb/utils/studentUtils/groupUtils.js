const db = require('../../models/db');

const provjeraParametaraPostG = (postBody) => {
    if (!postBody['idGrupaProjekta'] || !postBody['idProjekat']) return false;
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
    
    db.Projekat.findOne({where: {id:postBody['idProjekat']} }).then ((projekat)=>{
        //ako ne postoji projekat, vrati true
        if(!projekat) callback(true);
        else {
            db.GrupaProjekta.create(novi).then((grupa)=>{
                if(!grupa) callback(true);
                else callback(null, grupa);
            })
        }
    })
}

module.exports.provjeraParametaraPostG = provjeraParametaraPostG;
module.exports.upisNoveGrupeUBazu = upisNoveGrupeUBazu;