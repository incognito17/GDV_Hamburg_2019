/**
 * Dieser Block fügt Tooltips für die einzelnen Stadtteile hinzu.
 * Als Text wird im Moment die ID (was teilweise Name ist) hinzugefügt
 * */
$(document).ready(function(){
    let paths = d3.select('#Stadtteile_Fonds').selectAll('path');
    $.each(paths._groups[0], function(key, val){
        Tipped.create(`#${val.id}`,val.id);
    });
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
                color = "#fffed7";
            } else if (einnahmen >= 28634 && einnahmen <= 32679) {
                color = "#fffb9d";
            } else if (einnahmen >= 32680 && einnahmen <= 38848) {
                color = "#fffb44";
            } else if (einnahmen >= 38849 && einnahmen <= 52006) {
                color = "#ffdc10";
            } else if (einnahmen >= 52007 && einnahmen <= 120716) {
                color = "#ff9a00";
            } else {
                color = "lightgrey";
            }
            return color;
        });
    });
}

function nachLocationFaerben(location){
    $.getJSON( "json/location.json", function( data ) {
        d3.select('#Stadtteile_Fonds2').selectAll('path').attr('fill', function(d){
            let name = this.id;
            let loc;
            let color;
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
            if (loc == 0) {
                color = "#fcfaff";
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
        });
    });
}
/**
 * TODO:
 *
 * Platz für weitere Funktionen und Implementierungen.
 */
//Aufruf der Funktion zum färben
nachEinnahmenFaerben();
nachLocationFaerben("Bars");