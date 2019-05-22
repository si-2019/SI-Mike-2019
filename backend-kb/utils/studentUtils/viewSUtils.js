const db = require('../../models/db');

const dajSveProjekte = (id, callback) => {
    db.Projekat.findAll({ where: { idPredmet : id }})
        .then((rez) => {
            if(!rez) callback(true);
            else callback(null, rez);
            return null;
        })
        .catch((err) => callback(err))
}
 
const zaSvakiPredmetPopuniProjektneZadatke = (niz, callback) => {
    let nizIdeva = [];
    for(let i = 0; i < niz.length; ++i) nizIdeva.push(niz[i].id); 
    db.ProjektniZadatak.findAll({ where: { idProjekta : nizIdeva} })
      .then((rez) => {
          for(let i=0; i< niz.length; ++i){
              niz[i].zadaci = [];
              niz[i].zadaci = rez.filter(rez => rez.idProjekta === niz[i].id);
          }
        callback(null, niz);
    })
    .catch(err => callback(err));
}

const dajSvePredmete = (callback) => {
    db.Predmet.findAll()
        .then((rez) => {
            if(!rez) callback(true);
            else callback(null, rez);
            return null;
        })
        .catch((err) => callback(err));
}

module.exports = {
    dajSveProjekte,
    zaSvakiPredmetPopuniProjektneZadatke,
    dajSvePredmete
};