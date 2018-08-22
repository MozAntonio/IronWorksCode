/*
File:boundary.js
Versione: 1.0
Autore: Anna Poletti;
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-25
Anna Poletti, definizione costruttore classe,  2018-06-26
Antonio Moz, versione ufficiale, 2018-06-26
*/

import {ElementRD} from "./element.js";

export class Boundary extends ElementRD {
    constructor() {
        const element = super();

        element.elementRD.resize(98, 81); //equal to size of SVG
        element.elementRD.position(10, 140);
        element.elementRD.attr('label/text', 'Boundary');
        element.elementRD.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' +
            encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="98px" height="81px">' +
            '<g transform="translate(0.5,0.5)">' +
            '<path d="M 0 20 L 0 60" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>' +
            '<path d="M 0 40 L 16.67 40" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>' +
            '<ellipse cx="57" cy="40" rx="40" ry="40" fill="transparent" stroke="#000000" pointer-events="none"/></g></svg>'));

        element.elementRD.set('elementType', 'rd.Boundary');
        element.elementRD.set('color', '#000000');
    }
}