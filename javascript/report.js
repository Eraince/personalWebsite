var svg = d3.select("svg"),
    margin = {top: 10, right: 10, bottom: 10, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleBand().rangeRound([0, width]).padding(0.35),
    y = d3.scaleLinear().rangeRound([height, 0]);
  
var colours = d3.scaleOrdinal()
    .range(["#24C2CB", "#E1B753","#DA2536","#789F8A"]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("report.json", function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return d.pieces; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");
        // .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return parseInt(d / 1) + "%"; }).tickSizeInner([-width]))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Average House Price - (£)");

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.pieces); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return colours(d.pieces); })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.pieces) + "<br>" + "£" + (d.value));
        })
            .on("mouseout", function(d){ tooltip.style("display", "none");});

     g.selectAll(".bar")
        .data(data)
      .enter().append("text")
      .attr("class", "barLabel")
        .style("text-anchor", "end")
        .style("fill", "white")
        .attr("transform", function(d){
            var xText = x(d.pieces) + x.bandwidth() / 2;
            var yText = y(d.value);
            return "translate(" + xText + "," + yText + ") rotate(-90)";
        })
        .text(function(d) { return d.pieces;});
    });

    