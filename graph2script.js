var margin = { top: 70, right: 30, bottom: 40, left: 80 },
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xscale = d3.scaleLinear().domain([1980, 2020]).range([0, width])
var yscale = d3.scaleLinear().domain([0, 100]).range([height, 0]);


var line = d3.line()
    .x(function (d) { return xscale(d.year); })
    .y(function (d) { return yscale(d.oilprice); })
    .curve(d3.curveMonotoneX);

var combined = [];
var tooltip = [];
d3.csv("economic.csv").then(function (data) {
    for (let i = 0; i < 41; i++) {
        combined.push({ "year": +data[i].year, "oilprice": +data[i]["oil prices"], "income": +data[i].percapitaincome });
    }

    console.log(combined);

    var div = d3.select("#graph2").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // append the svg object to the body of the page
    var svg = d3.select("#graph2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Oil Price Over Time');

    // X label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Year');

    // Y label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-40,170)rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Oil Price(USD)');

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xscale).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(yscale));

    svg.append("path")
        .datum(combined)
        .attr("class", "line")
        .attr("d", line);

    svg.selectAll(".dot")
        .data(combined)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function (d) { return xscale(d.year) })
        .attr("cy", function (d) { return yscale(d.oilprice) })
        .attr("r", 5)
        .style("cursor", "pointer")
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(
                "Year: " + d.year + "<br>" +
                "Income: " + d.income
            )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

});