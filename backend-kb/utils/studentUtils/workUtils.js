const provjeraParametaraPostPZ = (postBody) => {
    if (!postBody['id_projekta'] || !postBody['prioritet'] || !postBody['od_kad'] || !postBody['do_kad']) return false;
    else return true;
}

const upisNovogPZuBazu = (postBody, opis, zavrsen, komentar_a) => {
    // kod za dodavanje u neku bazu, to be urađeno dok se vođe skontaju
    // ...
    // pretpostavimo da je dodano u bazu
    // uspijesno, vracamo taj objekat
    let novi = {
        id_zadatka: 'novi_id',
        id_projekta: postBody['id_projekta'],
        opis,
        prioritet: postBody['prioritet'],
        od_kad: postBody['od_kad'],
        do_kad: postBody['do_kad'],
        zavrsen,
        komentar_asistenta: komentar_a
    }
    return novi;
}

module.exports.provjeraParametaraPostPZ = provjeraParametaraPostPZ;
module.exports.upisNovogPZuBazu = upisNovogPZuBazu;