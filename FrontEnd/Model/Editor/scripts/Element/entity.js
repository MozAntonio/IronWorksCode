/*
File:entity.js
Versione: 1.0
Autore: Anna Poletti;
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-25
Anna Poletti, definizione costruttore classe,  2018-06-26
Antonio Moz, versione ufficiale, 2018-06-26
*/

import {ElementRD} from "./element.js";

export class Entity extends ElementRD {
    constructor() {
        const element = super();

        element.elementRD.resize(81, 81); //equal to size of SVG
        element.elementRD.position(20, 395);
        element.elementRD.attr('label/text', 'Entity');
        element.elementRD.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' +
            encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="81px">' +
            '<g transform="translate(0.5,0.5)">' +
            '<ellipse cx="40" cy="40" rx="40" ry="40" fill="transparent" stroke="#000000" pointer-events="none"/>' +
            '<path d="M 10 80 L 70 80" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/></g></svg>'));

        element.elementRD.set('elementType', 'rd.Entity');
        element.elementRD.set('color', '#000000');
        element.elementRD.set('access', 'default');
        element.elementRD.set('singleton', 'false');

        element.elementRD.set('attributes', []);
    }
}