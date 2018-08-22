/*
File: actor.js
Versione: 1.0
Autore: Antonio Moz;
Registro Modifiche:
Antonio Moz, creazione file, 2018-06-25
Antonio Moz, definizione costruttore classe,  2018-06-26
Antonio Moz, versione ufficiale, 2018-06-26
*/

import {ElementRD} from "./element.js";

export class Actor extends ElementRD {
    constructor() {
        const element = super();

        element.elementRD.resize(46, 91); //equal to size of SVG
        element.elementRD.position(35, 10);
        element.elementRD.attr('label/text', 'Actor');
        element.elementRD.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' +
            encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="46px" height="91px">' +
            '<g transform="translate(0.5,0.5)">' +
            '<ellipse cx="22.25" cy="11.5" rx="11.25" ry="11.25" fill="transparent" stroke="#000000" pointer-events="none"/>' +
            '<path d="M 22.5 22.5 L 22.5 60 M 22.5 30 L 0 30 M 22.5 30 L 45 30 M 22.5 60 L 0 90 M 22.5 60 L 45 90" ' +
            'fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/></g></svg>'));

        element.elementRD.set('elementType', 'rd.Actor');
        element.elementRD.set('color', '#000000');
    }
}