
/*
File: draganddrop.js
Versione: 3.0
Autore: Antonio Moz
Registro Modifiche:
Anna Poletti, creazione file, 2018-07-03
Anna Poletti, stesura funzione dragAndDrop, 2018-07-10
Anna Poletti,inserimento paper invisibile , 2018-07-11
Antonio Moz, versione ufficiale, 2018-07-18
*/


import {elementsGraph} from "../editor.js";
import {editorGraph} from "../editor.js";

/* Descrizione: la funzione si occupa di permettere l'inserimento tramite "Drag & Drop" di un elemento nel diagramma. */
export function dragAndDrop() {

    //Aggiungo l'evento "pointerdown" agli elementi presenti nel menu dei possibili elementi da inserire
    elementsGraph.paperElement.on("cell:pointerdown", function(cellView, e, x, y) {
        //Aggiungo un "<div>" per inserire temporaneamente un "paper" invisibile d'appoggio
        //TODO: Sistemare tramite CSS il seguente:
        $("body").append('<div id="invisiblePaper" style="position:fixed;' +
            ' z-index:100; opacity:.2;"></div>');

        //Creo un "graph" ed un "paper" invisibili che servono per spostare gli elementi da un "paper" all'altro
        const invisibleGraph = new joint.dia.Graph;
        const invisiblePaper = new joint.dia.Paper({
            el: $("#invisiblePaper"),
            model: invisibleGraph,
            interactive: false,
            height: cellView.model.attributes.size.height+3,
            width: cellView.model.attributes.size.width,
			background: {
                color: "#E3F2FD"
            }
        });

        //Faccio la clone dell'elemento che voglio inserire tramite il "Drag & Drop"
        const invisibleShape = cellView.model.clone();
        //Salvo la posizione dell'elemento
        const pos = cellView.model.position();
        const offset = {
            x: x - pos.x,
            y: y - pos.y
        };

        //Aggiungo al "paper" invisibile la copia dell'elemento
        invisibleShape.position(0, 0);
        invisibleGraph.addCell(invisibleShape);

        //Cambio la posizione del "paper" invisibile
        $("#invisiblePaper").offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
        });

        //Quando muovo il mouse muovo anche il "paper" invisibile ed il suo contenuto (l'elemento che si vuole inserire)
        $("body").on("mousemove.inv", function(e) {
            $("#invisiblePaper").offset({
                left: e.pageX - offset.x,
                top: e.pageY - offset.y
            });
        });

        //All'evento "mouse-up" l'elemento si colloca dove indicato
        $("body").on("mouseup.inv", function(e) {
            //Calcolo dei valori per vedere se la posizione indicata per l'aggiunta dell'elemento è legale
            const x = e.pageX;
            const y = e.pageY;
            const target = editorGraph.paperEditor.$el.offset();

            //Se è dentro il foglio allora faccio la copia dell'elemento invisibile e lo inserisco dove richiesto
            if(x > target.left && x < target.left + editorGraph.paperEditor.$el.width() && y > target.top && y < target.top + editorGraph.paperEditor.$el.height()) {
                //Imposto delle variabili iniziali che descrivono i dati dell'elemento indicato
                const element = invisibleShape.clone();
                const type = element.attr("label/text");
                let color = "#000000";

                //L'elemento da inserire è un "Actor"
                if(type === "Actor") {
                    //Imposto il colore
                    color = $("#actorColor").spectrum("get");
                    //Imposto l'SVG dell'Actor
                    element.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg ' +
                        'xmlns="http://www.w3.org/2000/svg" version="1.1" width="46px" height="91px">' +
                        '<g transform="translate(0.5,0.5)">' +
                        '<ellipse cx="22.25" cy="11.5" rx="11.25" ry="11.25" fill="transparent" stroke="' +
                        color + '" pointer-events="none"/>' +
                        '<path d="M 22.5 22.5 L 22.5 60 M 22.5 30 L 0 30 M 22.5 30 L 45 30 M 22.5 60 L 0 90 ' +
                        'M 22.5 60 L 45 90" fill="none" stroke="' + color + '" stroke-miterlimit="10" ' +
                        'pointer-events="none"/>' +
                        '</g></svg>'));
                    //Imposto il nome
                    let name = $("#actorName").val();
                    if(name !== "") {
                        element.attr("label/text", name);
                    }
                    else {
                        element.attr("label/text", "Actor");
                    }
                }
                //L'elemento da inserire è un "Boundary"
                else if(type === "Boundary") {
                    //Imposto il colore
                    color = $("#boundaryColor").spectrum("get");
                    //Imposto l'SVG del Boundary
                    element.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg ' +
                        'xmlns="http://www.w3.org/2000/svg" version="1.1" width="98px" height="81px">' +
                        '<g transform="translate(0.5,0.5)">' +
                        '<path d="M 0 20 L 0 60" fill="none" stroke="' + color + '" stroke-miterlimit="10" ' +
                        'pointer-events="none"/>' +
                        '<path d="M 0 40 L 16.67 40" fill="none" stroke="' + color + '" stroke-miterlimit="10" ' +
                        'pointer-events="none"/>' +
                        '<ellipse cx="57" cy="40" rx="40" ry="40" fill="transparent" stroke="' + color + '" ' +
                        'pointer-events="none"/>' +
                        '</g></svg>'));
                    //Imposto il nome
                    let name = $("#boundaryName").val();
                    if(name !== "") {
                        element.attr("label/text", name);
                    }
                    else {
                        element.attr("label/text", "Boundary");
                    }
                }
                //L'elemento da inserire è un "Control"
                else if(type === "Control") {
                    color = $("#controlColor").spectrum("get");
                    //Imposto l'SVG del Control
                    element.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg ' +
                        'xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="92px">' +
                        '<g transform="translate(0.5,0.5)">' +
                        '<path d="M 29.63 12.38 L 49.38 0" fill="none" stroke="' + color + '" stroke-miterlimit="10" ' +
                        'pointer-events="none"/>' +
                        '<ellipse cx="40" cy="51" rx="39.5" ry="39.375" fill="transparent" stroke="' + color + '" ' +
                        'pointer-events="none"/>' +
                        '<path d="M 29.63 12.38 L 49.38 22.5" fill="none" stroke="' + color + '" stroke-miterlimit="10" ' +
                        'pointer-events="none"/>' +
                        '</g></svg>'));
                    //Imposto il nome
                    let name = $("#controlName").val();
                    if(name !== "") {
                        element.attr("label/text", name);
                    }
                    else {
                        element.attr("label/text", "Control");
                    }
                }
                //L'elemento da inserire è una "Entity"
                else if(type === "Entity") {
                    color = $("#entityColor").spectrum("get");
                    //Imposto l'SVG dell'Entity
                    element.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg ' +
                        'xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="81px">' +
                        '<g transform="translate(0.5,0.5)">' +
                        '<ellipse cx="40" cy="40" rx="40" ry="40" fill="transparent" stroke="' + color + '" ' +
                        'pointer-events="none"/>' +
                        '<path d="M 10 80 L 70 80" fill="none" stroke="' + color + '" stroke-miterlimit="10" ' +
                        'pointer-events="none"/>' +
                        '</g></svg>'));
                    //Imposto il nome
                    let name = $("#entityName").val();
                    if(name !== "") {
                        element.attr("label/text", name);
                    }
                    else {
                        element.attr("label/text", "Entity");
                    }

                    //Imposto il tipo di accesso dell'Entity
					if($("select#access option:checked").val() === "")
                        element.set("access", "default");
					else
						element.set("access", $("select#access option:checked").val());

                    //Imposto la marcatura o meno a Singleton dell'Entity
                    if($("#is-singleton")[0].checked)
                        element.set("singleton", "true");
                    else
                        element.set("singleton", "false");
                }

                //Salvo il colore indicato per l'elemento
                element.set("color", color);

                //Imposto la posizione dell'elemento
                element.position(x - target.left - offset.x, y - target.top - offset.y);

                /* Controllo che non ci siano altri elementi già presenti nel diagramma con lo stesso nome
                   dell'elemento da inserire, e che il nome indicato non contenga caratteri speciali e non
                   inizi con un numero
                */
                const allElement = editorGraph.graphEditor.getElements();
				let find = false;
                let sanitized = (element.attributes.attrs["label"]["text"]).split(/[^\w\s]/).join("");
                sanitized = sanitized.replace(/^[\d-]*\s*/, "");

                if(sanitized !== element.attributes.attrs["label"]["text"]) {
                    element.attributes.attrs["label"]["text"] = sanitized;
                    alert("The element's name can not have special characters and can not start with a number.");
                    find = true;
                }

				for(let i = 0; !find && i < allElement.length; i++) {
					const nameElement = allElement[i].attributes.attrs["label"]["text"];
					if(nameElement.toLowerCase() === sanitized.toLowerCase()) {
						alert("The element can not be created because already exists one with the same name.");
						find = true;
					}
				}

				/* Se non esiste alcun elemento già presente nel diagramma con lo stesso nome,
                   allora procedo con l'aggiunta dell'elemento richiesto
                */
				if(!find)
                    editorGraph.graphEditor.addCell(element);

                //Ripristino i valori di default dei campi dati degli elementi dopo l'inserimento
                //Campo "nome"
                $("#actorName").val("");
				$("#actorName").blur();
                $("#boundaryName").val("");
				$("#boundaryName").blur();
                $("#controlName").val("");
				$("#controlName").blur();
                $("#entityName").val("");
				$("#entityName").blur();
				//Campo "colore"
                $("#actorColor").spectrum("set", "#000000");
                $("#actorColor").blur();
                $("#boundaryColor").spectrum("set", "#000000");
                $("#boundaryColor").blur();
                $("#controlColor").spectrum("set", "#000000");
                $("#controlColor").blur();
                $("#entityColor").spectrum("set", "#000000");
                $("#entityColor").blur();
                //Campo "accesso" e "singleton" dell'Entity
                $("#access").val("");
				$("#access").blur();
                $("#is-singleton")[0].checked = false;
            }

            //Cancello quello che ho creato precedentemente per permettere il "Drag & Drop"
            $("body").off("mousemove.inv").off("mouseup.inv");
            invisibleShape.remove();
            $("#invisiblePaper").remove();
        });
    });
}