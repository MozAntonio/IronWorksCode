/*
File: errorhandler.js
Versione: 1.0
Autore: Francesco Sacchetto
Registro Modifiche:
Francesco Sacchetto, creazione file, 2018-06-21
Francesco Sacchetto, stesura file, 2018-06-21
Descrizione: questo file riceve chiamte REST non previste o che 
indicano una risorsa non presente e risponde con un redirect.
*/
exports.handler = (req, res, next) =>{
    res.redirect('back');
}