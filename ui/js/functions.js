/**
 * Dieser Block fügt Tooltips für die einzelnen Stadtteile hinzu.
 * Als Text wird im Moment die ID (was teilweise Name ist) hinzugefügt
 * */
$(document).ready(function(){
    let stadtteile = d3.select('#Stadtteile_Fonds2').selectAll('path');
    stadtteile[0].forEach(dialogKreiren);
    //Überschrift der Karte 2 ändern
    $("#h1_karte2").text("Locations: "+document.getElementById("auswahl").value);

    //dialog generieren
    $("#dialog").dialog({
        autoOpen: false,
        width: 'auto',
        close: function(event, ui) {
            $("#dialog").html("");
        }
    });

    //Aufruf der Funktion zum färben
    nachEinnahmenFaerben();
    nachLocationFaerben("Bars");
});

/**
 * Selektiert jedes Element aus dem Stadtteil-Array
 */
function dialogKreiren(stadtteil){
    let stadtTeilId = stadtteil.id;
    let selektorId = "#"+stadtTeilId;
    $(selektorId).click(function(){
        tortenDiagrammErstellen(stadtTeilId);
        $("#dialog").dialog("open");
    });
}

/**
 * Diese Funktion selektiert die Einnahme-Daten (als JSON)
 * und färbt dementsprechend die erste Karte.
 * (Mehr Einnahmen = dunklere Farbe)
 */
function nachEinnahmenFaerben(){
    $.getJSON( "json/geld.json", function( data ) {
        let styl3;
        let styleCircle;
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
        }).on("mouseover", function(){
           styl3 = document.getElementById(this.id+"2").style.fill;
           styleCircle = document.getElementById(this.id+"C").style.fill;
            document.getElementById(this.id+"2").style.fill="lime";
            document.getElementById(this.id+"C").style.fill="lime";
        }).on("mouseout", function(){
            document.getElementById(this.id+"2").style.fill=styl3;
            document.getElementById(this.id+"C").style.fill=styleCircle;
        });
    });
}

function nachLocationFaerben(location){
    $("#h1_karte2").text("Locations: "+location);
    $.getJSON( "json/location.json", function( data ) {
        let styl3;
        let styleCircle;
        d3.select('#Stadtteile_Fonds2').selectAll('path').attr('fill', function(d){
            let name = this.id;
            let loc;
            let kategorie;
            $.each(data, function(key, val){
                if (name == val.Stadtteil+"2"){
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
        }).on("mouseover", function(){
            let name = this.id;
            name = name.substring(0, name.length-1);
            styl3=document.getElementById(name).style.fill;
            styleCircle = document.getElementById(name+"C").style.fill;
            document.getElementById(name).style.fill="lime";
            document.getElementById(name+"C").style.fill="lime";
        }).on("mouseout", function(){
            let name = this.id;
            name = name.substring(0, name.length-1);
            document.getElementById(name).style.fill=styl3;
            document.getElementById(name+"C").style.fill=styleCircle;
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
        color = "rgb(255,172,233)";
    } else if (loc == 2) {
        color = "#ff7be0";
    } else if (loc >= 3 && loc <= 4) {
        color = "#ff2dfa";
    } else if (loc >= 5) {
        color = "#ff23b0";
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
        color = "rgb(255,245,199)";
    } else if (loc == 2) {
        color = "#fff78c";
    } else if (loc >= 3 && loc <= 4) {
        color = "#ffe857";
    } else if (loc >= 5 && loc <= 7) {
        color = "#ffd321";
    } else if (loc >= 8) {
        color = "#ff9c00";
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
        color = "rgb(171,255,160)";
    } else if (loc == 2) {
        color = "#81ff79";
    } else if (loc >= 3 && loc <= 4) {
        color = "#40ff3b";
    } else if (loc >= 5 && loc <= 7) {
        color = "#1dec1e";
    } else if (loc >= 8) {
        color = "#00da17";
    } else {
        color = "lightgrey";
    }
    return color;
}