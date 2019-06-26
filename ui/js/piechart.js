function tortenDiagrammErstellen(stadtteil){
    var width = 550;          //width
    var height = 350;        //height
    var radius = 300/ 2;   //radius of the pie-chart
    var color = d3.scale.category20b();    //builtin range of colors
    var svg = d3.select("#dialog")        //create the SVG element inside the <body>
        .append('svg').attr('width', width) //set the width and height of our visualization
        .attr('height', height) // attributes of the <svg> tag
        .append('g')              //create a group to hold our pie chart
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');//move the center of the pie chart from 0, 0 to specified value
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

        for(var a=0;a<locationsData.length;a++){
            total=total+parseInt(locationsData[a].count); // simple logic to calculate total of data count value
        }
        var pie_data=[];
        for( var a=0;a<locationsData.length;a++){ // simple logic to calculate percentage data for the pie
            pie_data[a]=(locationsData[a].count/total)*100;
        }
        var arc = d3.svg.arc().outerRadius(radius);
// creating arc element.
        var pie = d3.layout.pie()
            .value(function(d,i) { return pie_data[i]; })
            .sort(null);
//Given a list of values, it will create an arc data for us
//we must explicitly specify it to access the value of each element in our data array
        var path = svg.selectAll('path')
            .data(pie(locationsData))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return locationsData[i].color;
            });
//set the color for each slice to be chosen, from the color defined in sample_data.json
//this creates the actual SVG path using the associated data (pie) with the arc drawing function
    });
    let stName = stadtteil;
    stName = stName.substring(0, stName.length-1);
    (stName == "StGeorg") ? stName = "St. Georg" : stName;
    (stName == "StPauli") ? stName = "St. Pauli" : stName;
    $("#dialog").append(`<h1>${stName}</h1>`);
}