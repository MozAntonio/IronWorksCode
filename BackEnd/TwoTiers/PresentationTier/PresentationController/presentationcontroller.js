/*
File: presentationcontroller.js
Versione: 1.0
Autore: Francesco Sacchetto
Registro Modifiche:
Francesco Sacchetto, creazione file, 2018-06-21
Francesco Sacchetto, stesura file, 2018-06-21
Descrizione: questo file risponde ad una chiamata get sulla porta 3000
ritornando la pagina principale da caricare nel browser.
*/

var path = require('path');

exports.getIndex = () => {
	return path.join(__dirname, '../../../../FrontEnd/View', 'index.html');
}
