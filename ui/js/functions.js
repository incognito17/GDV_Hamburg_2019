/**
 * Dieser Block fügt Tooltips für die einzelnen Stadtteile hinzu.
 * Als Text wird im Moment die ID (was teilweise Name ist) hinzugefügt
 * */
$(document).ready(function(){
    let paths = d3.select('#Stadtteile_Fonds').selectAll('path');
    $.each(paths[0], function(key, val){
        Tipped.create(`#${val.id}`,val.id);
    });
    //Überschrift der Karte 2 ändern
    $("#h1_karte2").text("Locations: "+document.getElementById("auswahl").value);
    //Aufruf der Funktion zum färben
    nachEinnahmenFaerben();
    nachLocationFaerben("Bars");
});
/**
 * Diese Funktion selektiert die Einnahme-Daten (als JSON)
 * und färbt dementsprechend die erste Karte.
 * (Mehr Einnahmen = dunklere Farbe)
 */
function nachEinnahmenFaerben(){
    $.getJSON( "json/geld.json", function( data ) {
        d3.select('#Stadtteile_Fonds').selectAll('path').attr('fill', function(d){
            let name = this.id;
            let einnahmen;
            let color;
            $.each(data, function(key, val){
                if (name == val.name){
                    einnahmen = val.geld;
                }
            });
            if (einnahmen >= 13777 && einnahmen <= 28633) {
                color = "#bdffec";
            } else if (einnahmen >= 28634 && einnahmen <= 32679) {
                color = "#76eeff";
            } else if (einnahmen >= 32680 && einnahmen <= 38848) {
                color = "#4fbaff";
            } else if (einnahmen >= 38849 && einnahmen <= 52006) {
                color = "#4a6aff";
            } else if (einnahmen >= 52007 && einnahmen <= 120716) {
                color = "#0001ff";
            } else {
                color = "lightgrey";
            }
            return color;
        });
    });
}

function nachLocationFaerben(location){
    $("#h1_karte2").text("Locations: "+location);
    $.getJSON( "json/location.json", function( data ) {
        d3.select('#Stadtteile_Fonds2').selectAll('path').attr('fill', function(d){
            let name = this.id;
            let loc;
            let kategorie;
            $.each(data, function(key, val){
                if (name == val.Stadtteil){
                    if (location=="Bars"){
                        loc=val.Bars;
                    } else if (location=="Diskotheken") {
                        loc=val.Diskotheken;
                    } else if (location=="Kinos") {
                        loc=val.Kinos;
                    } else if (location=="Theater") {
                        loc=val.Theater;
                    } else if (location=="Museen") {
                        loc=val.Museen;
                    }
                }
            });

            if (location=="Bars"){
                return barsFaerben(loc);
            } else if (location=="Diskotheken") {
                return diskoFaerben(loc);
            } else if (location=="Kinos") {
                return kinoFaerben(loc);
            } else if (location=="Theater") {
                return theaterFaerben(loc);
            } else if (location=="Museen") {
                return museenFaerben(loc);
            }
        });
    });
}
/**
 * TODO:
 *
 * Platz für weitere Funktionen und Implementierungen.
 */

function barsFaerben(loc) {
    let color;
    if (loc == 0) {
        color = "#ffffff";
    } else if (loc >= 1 && loc <= 6) {
        color = "rgb(255,224,192)";
    } else if (loc >= 7 && loc <= 13) {
        color = "#ffef3a";
    } else if (loc >= 14 && loc <= 20) {
        color = "#ffad00";
    } else if (loc >= 21 && loc <= 30) {
        color = "#ff6800";
    } else if (loc >= 31 && loc <= 40) {
        color = "#ff0000";
    } else if (loc >= 41) {
        color = "#d9005f";
    } else {
        color = "lightgrey";
    }
    return color;
}

function diskoFaerben(loc) {
    let color;
    if (loc == 0) {
        color = "#ffffff";
    } else if (loc == 1) {
        color = "rgb(255,212,254)";
    } else if (loc == 2) {
        color = "#fc8dff";
    } else if (loc >= 3 && loc <= 4) {
        color = "#fe3cff";
    } else if (loc >= 5) {
        color = "#fe00ff";
    } else {
        color = "lightgrey";
    }
    return color;
}

function kinoFaerben(loc) {
    let color;
    if (loc == 0) {
        color = "#ffffff";
    } else if (loc == 1) {
        color = "rgb(156,200,255)";
    } else if (loc == 2) {
        color = "#4da1ff";
    } else if (loc >= 3) {
        color = "#3056ff";
    }  else {
        color = "lightgrey";
    }
    return color;
}

function theaterFaerben(loc) {
    let color;
    if (loc == 0) {
        color = "#ffffff";
    } else if (loc == 1) {
        color = "rgb(255,251,216)";
    } else if (loc == 2) {
        color = "#fffcac";
    } else if (loc >= 3 && loc <= 4) {
        color = "#fffa72";
    } else if (loc >= 5 && loc <= 7) {
        color = "#fff934";
    } else if (loc >= 8) {
        color = "#ffca00";
    } else {
        color = "lightgrey";
    }
    return color;
}

function museenFaerben(loc) {
    let color;
    if (loc == 0) {
        color = "#ffffff";
    } else if (loc == 1) {
        color = "rgb(199,255,196)";
    } else if (loc == 2) {
        color = "#a0ff9c";
    } else if (loc >= 3 && loc <= 4) {
        color = "#4fff5d";
    } else if (loc >= 5 && loc <= 7) {
        color = "#1dec1e";
    } else if (loc >= 8) {
        color = "#20da00";
    } else {
        color = "lightgrey";
    }
    return color;
}