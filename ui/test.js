//Call csv File
d3.csv("data.csv", function (error, data) {
    //Check For Error
    if (error) console.log("Error");
    /*
    Check For Data
    data.forEach(function (d) {
        console.log("X Is "+ d.x);
        console.log("Y Is "+ d.y);
    });
    */
    //Create Margin
    var margin = { top: 40, right: 20, bottom: 60, left: 100 },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    /*
   define scale then followed by axis
   */
    // define x and y scales
    // define x and y scales
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
    // define x axis and y axis
    var xAxis = d3.svg.axis().
    scale(xScale).
    orient("bottom");
    var yAxis = d3.svg.axis().
    scale(yScale).
    orient("left");

    /*
   create svg element then append height and width and g which act as a container
   */
    var svg = d3.select("#scatterplot").
    append("svg").
    attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
    }).
    append("g").
    attr("transform", "translate(" + margin.left + "," + margin.right + ")");


    // Draw xAxis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    //Name für X-Achse
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Entfernung zur Stadtmitte in KM");

    //Draw yAxis
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
        .text("Einkünfte pro Steuerpflichtigen in €");

    /* create bar or bind data*/
    //bind data
    svg.selectAll("circle")
        .data(data)
        //enter data
        .enter().
    append("circle")
    //update data
        .attr("class", "circle")
        .attr("cx", function (d) { return xScale(d.Entfernung); })
        .attr("cy", function (d) { return yScale(d.Einkünfte); })
        .attr("r", 8);
});