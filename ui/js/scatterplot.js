//csv-Datei aufrufen
d3.csv("data.csv", function (error, data) {

    let styl3;
    let styl4;

    //Wenn Fehler, dann auf Konsole ausgeben.
    if (error) console.log("Error");

    //Margin erstellen
    var margin = { top: 40, right: 20, bottom: 60, left: 100 },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    /*
   Skalierung und Achsen definieren.
   */
    // x und y Skalierungen definieren
    xMax = d3.max(data, function (d) {
        return +d.Entfernung;
    });
    yMax = d3.max(data, function (d) {
        return +d.Einkünfte;
    });
    var xScale = d3.scale.linear().
    domain([0, xMax]).
    range([0, width]);
    var yScale = d3.scale.linear().
    domain([0, yMax]).
    range([height, 0]);
    // x und y Achsen definieren
    var xAxis = d3.svg.axis().
    scale(xScale).
    orient("bottom");
    var yAxis = d3.svg.axis().
    scale(yScale).
    orient("left");

    /*
    SVG-Element erstellen, Höhe, Breite und "g" (welches als Container dient) anhängen
   */
    var svg = d3.select("#scatterplot").
    append("svg").
    attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
    }).
    append("g").
    attr("transform", "translate(" + margin.left + "," + margin.right + ")");

    // x-Achse "zeichnen"
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    //Name für X-Achse
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Entfernung zur Stadtmitte in KM");

    //y-Achse "zeichnen"
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    //Name für Y-Achse
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Einkünfte pro Steuerpflichtigen in €");

    //Div für Tooltip erstellen
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    /* create bar or bind data*/
    //Datenbindung
    svg.selectAll("circle")
        .data(data)
        //enter data
        .enter().
    //die einzelnen Punkten mit Koordinaten aus Data anhängen
    append("circle")
        .attr("class", "circle")
        // Id wegen gleichzeitigen "hover"-Effekt hinzufügen
        .attr("id", function (d) {
            //Sonderfall wegen Namen von "StPauli" und "StGeorg" als ID
            let stadtteil = d.Stadtgebiet;
            if (stadtteil == "St. Pauli") {
                stadtteil = "StPauli";
            } else if (stadtteil == "St. Georg") {
                stadtteil = "StGeorg"
            }
            return stadtteil+"C";
        }).attr("cx", function (d) { return xScale(d.Entfernung); })
        .attr("cy", function (d) { return yScale(d.Einkünfte); })
        .attr("r", 8)
        //Färben bei "mouseonver" Effekt
        .on("mouseover", function(d){
            let stadtteil = d.Stadtgebiet;
            if (stadtteil == "St. Pauli") {
                stadtteil = "StPauli";
            } else if (stadtteil == "St. Georg") {
                stadtteil = "StGeorg"
            }
            //sich die Farbe der einzelnen Punkte als eine "globale" (nur für diese Datei) Variable merken
            //damit die Punkte nicht konstant grün bleiben.
            styl3 = document.getElementById(stadtteil).style.fill;
            styl4 = document.getElementById(stadtteil+"2").style.fill;
            document.getElementById(stadtteil).style.fill="lime";
            document.getElementById(stadtteil+"2").style.fill="lime";
            //Tooltip aufrufen
            div.transition()
                .duration(100)
                .style("opacity", .9);
            //Die Informationen dem Tooltip mitgeben
            div.html(d.Stadtgebiet+"<br/>Einkommen: "+d.Einkünfte+" €<br/>Entfernung: "+d.Entfernung+" km")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 60) + "px");
            // bei "mouseout" den einzelnen Punkt in die ursprüngliche Farbe färben.
        }).on("mouseout", function(d){
            let stadtteil = d.Stadtgebiet;
            if (stadtteil == "St. Pauli") {
                stadtteil = "StPauli";
            } else if (stadtteil == "St. Georg") {
                stadtteil = "StGeorg"
            }
            document.getElementById(stadtteil).style.fill=styl3;
            document.getElementById(stadtteil+"2").style.fill=styl4;
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });
});