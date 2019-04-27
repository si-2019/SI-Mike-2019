import db from '../../models/db';

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

export default {
    provjeraParametaraPostPZ,
    upisNovogPZuBazu
}