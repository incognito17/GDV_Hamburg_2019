function tortenDiagrammErstellen(stadtteil){
    var width = 550;          //Breite
    var height = 350;         //Höhe
    var radius = 300/ 2;      //Radius des Kreisdiagramms
    //Eingebaute Farbpalette
    var color = d3.scale.category20b();
    /**
     * SVG-Element innerhalb des Divs mit der ID "dialog" erstellen, Höhe und Breite setzen,
     * Gruppe "g", welche das eigentliche Diagramm beinhalten wird erstellen sowie
     * das Zentrum des Diagramms passend setzen.
     */
    var svg = d3.select("#dialog")
        .append('svg').attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');
    var total=0;
    d3.json("json/location.json", function(error, data) {
        //extra Objekt-Array erstellen mit Daten zu Bars etc., aus welchem dann
        //das Kuchendiagramm gebildet wird.
        let locationsData = [new Object(), new Object(), new Object(), new Object(), new Object()];
        $.each(data, function(key, val){
           if(stadtteil == val.Stadtteil+"2") {
               locationsData[0].count = val.Bars;
               locationsData[0].color = "red";
               locationsData[1].count = val.Diskotheken;
               locationsData[1].color = "violet";
               locationsData[2].count = val.Kinos;
               locationsData[2].color = "blue";
               locationsData[3].count = val.Theater;
               locationsData[3].color = "yellow";
               locationsData[4].count = val.Museen;
               locationsData[4].color = "green";
           }
        });
        //Die Gesamtanzahl der POIs berechnen
        for(var a=0;a<locationsData.length;a++){
            total=total+parseInt(locationsData[a].count);
        }
        //Den prozentuellen Anteil für Kuchendiagramm berechnen
        var pie_data=[];
        for( var a=0;a<locationsData.length;a++){
            pie_data[a]=(locationsData[a].count/total)*100;
        }
        // arc-Element erstellen
        var arc = d3.svg.arc().outerRadius(radius);
        var pie = d3.layout.pie()
            .value(function(d,i) { return pie_data[i]; })
            .sort(null);
        /**
         * Das eigentliche Kuchendiagramm "bauen" (mit den Daten aus locationsData-Array)
         * und jeden einzelnen Abschnitt mit gegebener Farbe färben lassen.
         */
        var path = svg.selectAll('path')
            .data(pie(locationsData))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return locationsData[i].color;
            });
    });
    //Den Stadtteilnamen als Titel zum PopUP-Dialoghinzufügen
    //Dabei die "StGeorg" und "StPauli" Sonderfälle beachten.
    let stName = stadtteil;
    stName = stName.substring(0, stName.length-1);
    (stName == "StGeorg") ? stName = "St. Georg" : stName;
    (stName == "StPauli") ? stName = "St. Pauli" : stName;
    $("#dialog").append(`<h1>${stName}</h1>`);
}