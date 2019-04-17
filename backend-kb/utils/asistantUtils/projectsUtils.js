const provjeraParametaraPostPZ = (postBody) => {
    if (!postBody['id_predmeta'] || !postBody['id_asistenta'] || !postBody['opis_projekta']
     || !postBody['moguci_bodovi']) return false;
    else return true;
}


module.exports.provjeraParametaraPostPZ = provjeraParametaraPostPZ;