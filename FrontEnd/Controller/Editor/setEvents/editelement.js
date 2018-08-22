/*
File: editelement.js
Versione: 4.0
Autore: Antonio Moz
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-10
Antonio Moz, implementazione funzioni di supporto, 2018-06-15
Antonio Moz, implementazione isSingleton() , 2018-06-16
Antonio Moz, implementazione funzione per permettere modifica, 2018-06-17
Antonio Moz, versione ufficiale, 2018-06-26
*/


import {editorGraph} from "../editor.js";

/* Imposto due variabili globali necessarie e manipolate dalle varie funzioni presenti in questo file */
//Variabile indicante l'elemento indicato
let elementDC = null;
//Variabile indicante il numero dinamico di attributi dell'Entity indicata
let totAttrs = 0;

/* Descrizione: la funzione si occupa di permettere la modifica di uno o più campi dati di un elemento del
   diagramma indicato dall'utente.
*/
export function editElement() {
    //Imposto l'evento "double-clicked" sull'elemento indicato
    editorGraph.paperEditor.on("cell:pointerdblclick", function(cellView) {
        //Mi salvo lo specifico elemento indicato
        elementDC = cellView;

        //Mostro il menu di modifica dei campi dati dell'elemento
        $("#edit-tile").attr("class", "show");
        //Pulisco eventuali oggetti rimasti da un'azione precedente
        $("#attributes-editable")[0].innerHTML = "";

        //Se l'elemento indicato è una "Linea di Associazione" non faccio altro e mi fermo, altrimenti proseguo
        if(cellView.model.get("type") !== "link") {
            //Aggiungo la possibilità di modificare il nome dell'elemento
            $("#attributes-editable").append('<div class="group">' +
                '<input id="elementName" type="text" name="elementName" size="8" required="required"/>' +
                '<span class="highlight"></span>' +
                '<span class="bar"></span>' +
                '<label for="elementName">Name</label></div>');

            //Se l'elemento non è una "Entity" aggiungo subito anche la possibilità di modificarne il colore
			if(cellView.model.get("elementType") !== "rd.Entity") {
				$("#attributes-editable").append('<input id="editColor" type="text" class="colorPicker"/>' +
					'<div id="centerButton"><button class="material-button" id="confirmButton" title="Save changes">Save</button></div>');
			}
            //Se l'elemento è una "Entity" aggiungo un ulteriore contenitore per i vari campi aggiuntivi
			else {
				$("#attributes-editable").append('<div id="otherFields"></div>' +
					'<div id="attributes"></div>');
			}

			//Collego la chiamata di funzione per la conferma dei dati al bottone apposito
            $("#confirmButton").click(function() {
                confirmAction();
            });

			//Riempio la "textbox" del nome con il nome attuale dell'elemento
            $("#elementName").val(cellView.model.attr("label/text"));

            //Se l'elemento è una "Entity" aggiungo i relativi campi addizionali
            if(cellView.model.get("elementType") === "rd.Entity") {
                //Aggiungo la possibilità di modificare il tipo di accesso della "Entity"
                $("#otherFields").append('<div class="select">' +
                    '<select class="select-text" id="new-access" required="required">' +
                        '<option value="public">public</option>' +
                        '<option value="protected">protected</option>' +
                        '<option value="default">default</option>' +
                        '<option value="private">private</option>' +
                    '</select>' +
                    '<span class="select-highlight"></span>' +
                    '<span class="select-bar"></span>' +
                    '<label for="new-access" class="select-label">Access</label></div>');

                //Imposto il tipo di accesso con l'accesso attuale della "Entity"
                getAccess(cellView.model.get("access"));

                //Aggiungo la possibilità di modificare la marcatura o meno a singleton della "Entity"
                $("#otherFields").append('<label id="attribute-checkbox" for="new-is-singleton" class="material-checkbox">' +
						'<input id="new-is-singleton" name="new-is-singleton" type="checkbox" value="false"/>' +
						'<span>Singleton</span>' +
					'</label>');
					
				$("#otherFields").append('<input id="editColor" type="text" class="colorPicker"/>');

                //Imposto la marcatura o meno a singleton con la proprietà attuale della "Entity"
                isSingleton(cellView.model.get("singleton"));

                //Pulisco eventuali attributi rimasti da un'azione precedente
                $("#attributes")[0].innerHTML = "";
                //Carico tutti gli attributi già inseriti relativi a questa "Entity"
                totAttrs = 0;
                for(let i = 0; i < cellView.model.get("attributes").length; i++) {
                    showAttributes(i);
                    totAttrs++;
                }

                //Aggiungo il bottone per l'inserimento di un nuovo attributo
                $("#attributes").append('<div id="add-new-attr">' +
                    '<button class="material-button" id="addAttrBtn" title="Add a new attribute">Add</button>' +
					'<button class="material-button" id="confirmButton" title="Save changes">Save</button></div>');

                //Collego la chiamata di funzione per l'inserimento di un nuovo attributo al bottone apposito
                $("#addAttrBtn").click(function() {
                    addNewAttribute(totAttrs);
                });

                //Collego la chiamata di funzione per la conferma dei dati al bottone apposito
				$("#confirmButton").click(function() {
					confirmAction();
				});
            }

            //Imposto il "color picker" per la modifica del colore dell'elemento
            $(".colorPicker").spectrum({
                color: "#000",
                showInput: false,
                className: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                maxSelectionSize: 10,
                preferredFormat: "hex",
                localStorageKey: "spectrum.demo",
                palette: [
                    ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
                    ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                    ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
                ]
            });

            //Imposto il colore con il colore attuale dell'elemento
            $("#editColor").spectrum("set", cellView.model.get("color"));
        }
    });
}

/* Descrizione: la funzione si occupa di impostare il tipo di accesso attuale della "Entity" nel drop-down menu
   apposito per la sua eventuale modifica.
   Parametri: elementAccess, string, attuale tipo di accesso della "Entity".
*/
function getAccess(elementAccess) {
    $("#new-access option[value=" + elementAccess + "]").attr("selected", "selected");
    $("#new-access option[value=" + elementAccess + "]").val(elementAccess);
}

/* Descrizione: la funzione si occupa di impostare la marcatura o meno a singleton attuale della "Entity" nella
   "checkbox" apposita per la sua eventuale modifica.
   Parametri: boolValue, string, attuale marcatura o meno a singleton della "Entity".
*/
function isSingleton(boolValue) {
    if(boolValue === "true") {
        $("#new-is-singleton").attr("checked", "checked");
        $("#new-is-singleton")[0].checked = true;
    }
}

/* Descrizione: la funzione si occupa di mostrare i dati relativi ad un attributo della "Entity" per permettere
   una loro eventuale modifica.
   Parametri: indexAttr, integer, numero dell'attributo della "Entity" di cui mostrare i dati.
*/
function showAttributes(indexAttr) {
    $("#attributes").append('<div class="attr-number" id="attr-number-' + indexAttr + '"></div>');
	$("#attr-number-" + indexAttr).append('<div id="attr-fold-' + indexAttr + '">' +
        '<button id="attr-button-' + indexAttr + '" class="foldAttrBtn material-button" title="Fold this attribute"></button></div>');
	$("#attr-number-" + indexAttr).append('<div class="attributes-content" id="attributes-content-' + indexAttr + '"></div>');
    $("#attributes-content-" + indexAttr).append('<div id="attributes-access-' + indexAttr + '">' +
        '<div class="select">' +
			'<select class="select-text" id="attr-access-' + indexAttr + '" required="required">' +
				'<option value="public">public</option>' +
				'<option value="protected">protected</option>' +
				'<option value="default">default</option>' +
				'<option value="private">private</option>' +
			'</select>' +
			'<span class="select-highlight"></span>' +
			'<span class="select-bar"></span>' +
			'<label for="attr-access-' + indexAttr + '" class="select-label">Access</label></div></div>');

    const attrAccess = elementDC.model.get("attributes")[indexAttr]["access"];
    $("#attr-access-" + indexAttr + " option[value=" + attrAccess + "]").attr("selected", "selected");
    $("#attr-access-" + indexAttr + " option[value=" + attrAccess + "]").val(attrAccess);

    $("#attributes-content-" + indexAttr).append('<div class="attr-type" id="attributes-type-' + indexAttr + '">' +
        '<div class="select">' +
			'<select class="select-text" id="attr-type-' + indexAttr + '" required="required">' +
				'<optgroup label="Base types:">' +
				'<option value="Boolean">Boolean</option>' +
				'<option value="Integer">Integer</option>' +
				'<option value="Float">Float</option>' +
				'<option value="Double">Double</option>' +
				'<option value="String">String</option>' +
				'<option value="Date">Date</option>' +
				'</optgroup>' +
				'<optgroup label="Array types:">' +
				'<option value="ArrayListBoolean">Boolean array</option>' +
                '<option value="ArrayListInteger">Integer array</option>' +
                '<option value="ArrayListFloat">Float array</option>' +
                '<option value="ArrayListDouble">Double array</option>' +
                '<option value="ArrayListString">String array</option>' +
                '<option value="ArrayListDate">Date array</option>' +
            '</select>' +
			'<span class="select-highlight"></span>' +
			'<span class="select-bar"></span>' +
			'<label for="attr-type-' + indexAttr + '" class="select-label">Type</label></div></div>');

    const attrType = elementDC.model.get("attributes")[indexAttr]["type"];
    if(attrType.substr(attrType.length - 2) !== "[]") {
        $("#attr-type-" + indexAttr + " option[value=" + attrType + "]").attr("selected", "selected");
        $("#attr-type-" + indexAttr + " option[value=" + attrType + "]").val(attrType);
    }
    else {
        $("#attr-type-" + indexAttr + " option[value=" + attrType.slice(0, -2) + "\\[\\]]").attr("selected", "selected");
        $("#attr-type-" + indexAttr + " option[value=" + attrType.slice(0, -2) + "\\[\\]]").val(attrType);
    }

    $("#attributes-content-" + indexAttr).append('<div class="attr-name" id="attributes-name-' + indexAttr + '">' +
		'<div class="group">' +
			'<input id="attr-name-' + indexAttr + '" type="text" name="attr-name-' + indexAttr + '" size="8" required="required"/>' +
			'<span class="highlight"></span>' +
			'<span class="bar"></span>' +
			'<label for="attr-name-' + indexAttr + '">Name</label>' +
		'</div></div>');

    $("#attr-name-" + indexAttr).val(elementDC.model.get("attributes")[indexAttr]["name"]);
	$("#attr-button-" + indexAttr).html(elementDC.model.get("attributes")[indexAttr]["name"] + '&#8691;');

    $("#attributes-content-" + indexAttr).append('<div id="attr-remove-' + indexAttr + '">' +
        '<button class="removeAttrBtn material-button" title="Remove this attribute">Remove</button></div></div>');
		
	$("#attr-fold-" + indexAttr + " .foldAttrBtn").click(function() {
		$("#attributes-content-" + indexAttr).toggle(500);
	});

    $("#attr-remove-" + indexAttr + " .removeAttrBtn").click(function() {
        const parentId = $(this).parent().attr("id");
        const realIndexAttr = parentId.slice(12, parentId.length);
        removeAttribute(realIndexAttr);
    });
}

/* Descrizione: la funzione si occupa di mostrare i campi per permettere l'inserimento di un nuovo attributo alla
   "Entity" selezionata.
   Parametri: indexAttr, integer, numero dell'attributo della "Entity" di cui mostrare i campi per il nuovo inserimento.
*/
function addNewAttribute(indexAttr) {
    totAttrs++;
    $("#add-new-attr").remove();

    $("#attributes").append('<div class="attr-number" id="attr-number-' + indexAttr + '"></div>');
	$("#attr-number-" + indexAttr).append('<div id="attr-fold-' + indexAttr + '">' +
		'<button id="attr-button-' + indexAttr + '" class="foldAttrBtn material-button" title="Fold this attribute"></button></div>');
	$("#attr-fold-" + indexAttr).css("display","none");
	$("#attr-number-" + indexAttr).append('<div id="attributes-content-' + indexAttr + '"></div>');
    $("#attributes-content-" + indexAttr).append('<div id="attributes-access-' + indexAttr + '">' +
        '<div class="select">' +
			'<select class="select-text" id="attr-access-' + indexAttr + '" required="required">' +
				'<option value="" disabled="disabled" selected="selected"></option>' +
				'<option value="public">public</option>' +
				'<option value="protected">protected</option>' +
				'<option value="default">default</option>' +
				'<option value="private">private</option>' +
			'</select>' +
			'<span class="select-highlight"></span>' +
			'<span class="select-bar"></span>' +
			'<label for="attr-access-' + indexAttr + '" class="select-label">Access</label></div></div>');

    $("#attributes-content-" + indexAttr).append('<div class="attr-type" id="attributes-type-' + indexAttr + '">' +
        '<div class="select">' +
			'<select class="select-text" id="attr-type-' + indexAttr + '" required="required">' +
				'<option value="" disabled="disabled" selected="selected"></option>' +
				'<optgroup label="Base types:">' +
				'<option value="boolean">Boolean</option>' +
				'<option value="Integer">Integer</option>' +
				'<option value="Float">Float</option>' +
				'<option value="Double">Double</option>' +
				'<option value="String">String</option>' +
				'<option value="Date">Date</option>' +
				'</optgroup>' +
				'<optgroup label="Array types:">' +
                '<option value="ArrayListBoolean">Boolean array</option>' +
                '<option value="ArrayListInteger">Integer array</option>' +
                '<option value="ArrayListFloat">Float array</option>' +
                '<option value="ArrayListDouble">Double array</option>' +
                '<option value="ArrayListString">String array</option>' +
                '<option value="ArrayListDate">Date array</option>' +
                '</optgroup>' +
			'</select>' +
			'<span class="select-highlight"></span>' +
			'<span class="select-bar"></span>' +
			'<label for="attr-type-' + indexAttr + '" class="select-label">Type</label></div></div>');

    $("#attributes-content-" + indexAttr).append('<div class="attr-name" id="attributes-name-' + indexAttr + '">' +
        '<div class="group">' +
			'<input id="attr-name-' + indexAttr + '" type="text" name="attr-name-' + indexAttr + '" size="8" required="required"/>' +
			'<span class="highlight"></span>' +
			'<span class="bar"></span>' +
			'<label for="attr-name-' + indexAttr + '">Name</label>' +
		'</div></div>');	

    $("#attributes-content-" + indexAttr).append('<div id="attr-remove-' + indexAttr + '">' +
        '<button class="removeAttrBtn material-button" title="Remove this attribute">Remove</button></div></div>');
		
	$("#attr-fold-" + indexAttr + " .foldAttrBtn").click(function() {
		$("#attributes-content-" + indexAttr).toggle(500);
	});
	
    $("#attr-remove-" + indexAttr + " .removeAttrBtn").click(function() {
        const parentId = $(this).parent().attr("id");
        const realIndexAttr = parentId.slice(12, parentId.length);
        removeAttribute(realIndexAttr);
    });

    $("#attributes").append('<div id="add-new-attr">' +
        '<button class="material-button" id="addAttrBtn" title="Add a new attribute">Add</button>' +
		'<button class="material-button" id="confirmButton" title="Save changes">Save</button></div>');

    $("#addAttrBtn").click(function() {
		let tmpAccess = $("select#attr-access-" + indexAttr + " option:checked").val();
        let tmpType = $("select#attr-type-" + indexAttr + " option:checked").val();
        let sanitized = ($("#attr-name-" + indexAttr).val()).split(/[^\w\s]/).join("");
        sanitized = sanitized.replace(/^[\d-]*\s*/, "");
        let tmpName = sanitized;
		if((tmpAccess !== "") && (tmpType !== "") && (tmpName !== "")) {
			$("#attributes-content-" + indexAttr).css("display","none");
			$("#attr-fold-" + indexAttr).css("display","block");
			$("#attr-button-" + indexAttr).html($("#attr-name-" + indexAttr).val() + '&#8691;');
			addNewAttribute(totAttrs);
		}
		else {
			alert("Fill in all fields to insert the attribute");
		}
    });

	$("#confirmButton").click(function() {
        confirmAction();
    });
}

/* Descrizione: la funzione si occupa di rimuovere l'attributo indicato dalla "Entity" selezionata.
   Parametri: indexAttr, integer, numero dell'attributo da rimuovere dalla "Entity" selezionata.
*/
function removeAttribute(indexAttr) {
    $("#attr-number-" + indexAttr).remove();
}

/* Descrizione: la funzione si occupa di salvare le modifiche effettuate ai campi dati della "Entity" selezionata,
   o di segnalare eventuali errori all'utente.
*/
function confirmAction() {
	const allElement = editorGraph.graphEditor.getElements();
	let equal = false;
	let sanitized = ($("#elementName").val()).split(/[^\w\s]/).join("");
	sanitized = sanitized.replace(/^[\d-]*\s*/, "");
    if(sanitized !== $("#elementName").val()) {
        alert("The element's name can not have special characters and can not start with a number");
        equal = true;
    }
	for(let i = 0; !equal && i < allElement.length; i++) {
		let nameElement = allElement[i].attributes.attrs["label"]["text"];
		if(sanitized == "") {
			alert("It was not possible to rename the element because the name must contain at least one character");
			equal = true;
		}
		else if(nameElement.toLowerCase() === sanitized.toLowerCase() && nameElement !== elementDC.model.attributes.attrs["label"]["text"]) {
			alert("It was not possible to rename the element because already exists one with the same name");
			equal = true;
		}
	}
	if(!equal) {
        elementDC.model.attr("label/text", sanitized);

        const color = $("#editColor").spectrum("get");
        elementDC.model.set("color", color);

        switch(elementDC.model.get("elementType")) {
            case "rd.Actor":
                $("g[model-id=" + elementDC.model.id + "] image").attr('xlink:href', 'data:image/svg+xml;utf8,' +
                    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="46px" height="91px">' +
                        '<g transform="translate(0.5,0.5)">' +
                        '<ellipse cx="22.25" cy="11.5" rx="11.25" ry="11.25" fill="transparent" stroke="' +
                        color + '" pointer-events="none"/>' +
                        '<path d="M 22.5 22.5 L 22.5 60 M 22.5 30 L 0 30 M 22.5 30 L 45 30 M 22.5 60 L 0 90 ' +
                        'M 22.5 60 L 45 90" fill="none" stroke="' + color + '" stroke-miterlimit="10" pointer-events="none"/>' +
                        '</g></svg>'));
                break;
            case "rd.Boundary":
                $("g[model-id=" + elementDC.model.id + "] image").attr('xlink:href', 'data:image/svg+xml;utf8,' +
                    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="98px" height="81px">' +
                        '<g transform="translate(0.5,0.5)">' +
                        '<path d="M 0 20 L 0 60" fill="none" stroke="' + color + '" stroke-miterlimit="10" pointer-events="none"/>' +
                        '<path d="M 0 40 L 16.67 40" fill="none" stroke="' + color + '" stroke-miterlimit="10" pointer-events="none"/>' +
                        '<ellipse cx="57" cy="40" rx="40" ry="40" fill="transparent" stroke="' + color + '" pointer-events="none"/>' +
                        '</g></svg>'));
                break;
            case "rd.Control":
                $("g[model-id=" + elementDC.model.id + "] image").attr('xlink:href', 'data:image/svg+xml;utf8,' +
                    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="92px">' +
                        '<g transform="translate(0.5,0.5)">' +
                        '<path d="M 29.63 12.38 L 49.38 0" fill="none" stroke="' + color + '" stroke-miterlimit="10" pointer-events="none"/>' +
                        '<ellipse cx="40" cy="51" rx="39.5" ry="39.375" fill="transparent" stroke="' + color + '" pointer-events="none"/>' +
                        '<path d="M 29.63 12.38 L 49.38 22.5" fill="none" stroke="' + color + '" stroke-miterlimit="10" pointer-events="none"/>' +
                        '</g></svg>'));
                break;
            case "rd.Entity":
                $("g[model-id=" + elementDC.model.id + "] image").attr('xlink:href', 'data:image/svg+xml;utf8,' +
                    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="81px">' +
                        '<g transform="translate(0.5,0.5)">' +
                        '<ellipse cx="40" cy="40" rx="40" ry="40" fill="transparent" stroke="' + color + '" pointer-events="none"/>' +
                        '<path d="M 10 80 L 70 80" fill="none" stroke="' + color + '" stroke-miterlimit="10" pointer-events="none"/>' +
                        '</g></svg>'));
                break;
            default:
                break;
        }

        if(elementDC.model.get("elementType") === "rd.Entity") {
            elementDC.model.set("access", $("select#new-access option:checked").val());

            if($("#new-is-singleton")[0].checked) {
                elementDC.model.set("singleton", "true");
            }
            else {
                elementDC.model.set("singleton", "false");
            }

            const newAttributes = [];
            const arrayAttrs = $("#attributes").children();
            let equalAttr = false;

            for(let i = 0; i < arrayAttrs.length - 1 && !equalAttr; i++) {
                const indexAttr = arrayAttrs[i].getAttribute("id").slice(12, arrayAttrs[i].getAttribute("id").length);

                let tmpAccess = $("select#attr-access-" + indexAttr + " option:checked").val();
                let tmpType = $("select#attr-type-" + indexAttr + " option:checked").val();
                let sanitized = ($("#attr-name-" + indexAttr).val()).split(/[^\w\s]/).join("");
                sanitized = sanitized.replace(/^[\d-]*\s*/, "");
                let tmpName = sanitized;
                if(sanitized !== $("#attr-name-" + indexAttr).val()) {
                    alert("The attribute's name can not have special characters and can not start with a number.");
                    equalAttr = true;
                }
                for(let j = 0; !equalAttr && j < arrayAttrs.length - 1; j++) {
                    if(j !== Number(indexAttr) && tmpName.toLowerCase() === ($("#attr-name-" + j).val()).toLowerCase()) {
                        alert("The attributes can not be added. Please set a different name for each attributes.");
                        equalAttr = true;
                    }
                    else if(tmpName === "db_id") {
                        alert("The attributes can not be added. The attribute's name equal to \"db_id\" is reserved.");
                        equalAttr = true;
                    }
                }

                if(!equalAttr) {
                    if((tmpAccess !== "") && (tmpType !== "") && (tmpName !== "")) {
                        let tmpArray = {};
                        tmpArray["access"] = tmpAccess;
                        tmpArray["type"] = tmpType;
                        tmpArray["name"] = tmpName;
                        newAttributes.push(tmpArray);
                    }
					else {
						alert("Attributes with empty fields will not be inserted");
					}
                }
            }

            if(!equalAttr) {
                elementDC.model.set("attributes", newAttributes);
                $("#add-new-attr").remove();
                closeEditTile();
            }
        }
        else {
            closeEditTile();
        }
    }
}



/* Descrizione: la funzione si occupa di chiudere il pannello di modifica dei campi dati dell'elemento selezionato,
   ignorando eventuali modifiche apportati a tali campi dati.
*/
export function closeEditTile() {
    $("#edit-tile").attr("class", "hidden");

    if(elementDC.model.get("elementType") === "rd.Entity") {
        $("#otherFields")[0].innerHTML = "";
    }
}

/* Descrizione: la funzione si occupa di rimuovere dall'editor l'elemento sezionato. */
export function removeElement() {
    if((elementDC.model.get("type") === "link") || (confirm("Are you sure you want to delete this element?\n" +
        "Association lines connected to the element will be deleted."))) {
        elementDC.model.remove();
    }

    closeEditTile();
}