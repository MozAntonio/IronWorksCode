/*
File: control.js
Versione: 2.0
Autore: Anna Poletti;
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-21
Anna Poletti, implementazione costruttore 2018-06-22
Antonio Moz, versione ufficiale, 2018-06-26
*/
import {ElementRD} from "./element.js";

export class Control extends ElementRD {
    constructor() {
        const element = super();

        element.elementRD.resize(81, 92); //equal to size of SVG
        element.elementRD.position(20, 260);
        element.elementRD.attr('label/text', 'Control');
        element.elementRD.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' +
            encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="92px">' +
            '<g transform="translate(0.5,0.5)">' +
            '<path d="M 29.63 12.38 L 49.38 0" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>' +
            '<ellipse cx="40" cy="51" rx="39.5" ry="39.375" fill="transparent" stroke="#000000" pointer-events="none"/>' +
            '<path d="M 29.63 12.38 L 49.38 22.5" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/></g></svg>'));

        element.elementRD.set('elementType', 'rd.Control');
        element.elementRD.set('color', '#000000');
    }
}