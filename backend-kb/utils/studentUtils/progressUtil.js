const db = require('../../models/db');

const oznaciZavrsen = (id, cb) => {
    db.ProjektniZadatak.update({
        zavrsen: 1
    }), {
        where: {
            idProjektnogZadatka: id
        }
    }.then((rez) => {
        cb();
    }).catch(err => {
        cb();
    });     
}

module.exports = {
    oznaciZavrsen
}