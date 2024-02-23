let abFilter = 25;
const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = 0, scatterTop = 0;
let scatterMargin = { top: 10, right: 30, bottom: 30, left: 60 },
    scatterWidth = 400 - scatterMargin.left - scatterMargin.right,
    scatterHeight = 350 - scatterMargin.top - scatterMargin.bottom;

let distrLeft = 400, distrTop = 0;
let distrMargin = { top: 10, right: 30, bottom: 30, left: 60 },
    distrWidth = 400 - distrMargin.left - distrMargin.right,
    distrHeight = 350 - distrMargin.top - distrMargin.bottom;

let teamLeft = 0, teamTop = 400;
let teamMargin = { top: 10, right: 30, bottom: 30, left: 60 },
    teamWidth = width - teamMargin.left - teamMargin.right,
    teamHeight = height - 450 - teamMargin.top - teamMargin.bottom;

// Define opacity levels
const opacityHigh = 1;
const opacityLow = 0.1;

d3.csv("data/pokemon.csv").then(rawData => {
    console.log("rawData", rawData);
    const typeToColor = {
        "Grass": "#78C850",
        "Fire": "#F08030",
        "Water": "#6890F0",
        "Bug": "#A8B820",
        "Normal": "#008080",
        "Poison": "#A040A0",
        "Electric": "#F8D030",
        "Ground": "#E0C068",
        "Fairy": "#EE99AC",
        "Fighting": "#C03028",
        "Psychic": "#F85888",
        "Rock": "#B8A038",
        "Ghost": "#705898",
        "Ice": "#98D8D8",
        "Dragon": "#7038F8",
        "Dark": "#705848",
        "Steel": "#B8B8D0",
        "Flying": "#A890F0"
    };

// Plot 1: Scatterplot of Psychic type Attack vs Special Attack
// Plot 1: Scatterplot of Psychic type Attack vs Special Attack
firstData = rawData.map(d => {
    return {
        "Sp_Atk": +d.Sp_Atk,
        "Attack": +d.Attack,
        "Type_1": d.Type_1
    };
});

// Plot the scatterplot
const svg = d3.select("svg");

const g1 = svg.append("g")
    .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
    .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
    .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top + 30})`);

// Define the zoom function
const zoom = d3.zoom()
    .scaleExtent([0.5, 10]) // Set the scale extent for zooming
    .on("zoom", zoomed);

// Apply the zoom behavior to the SVG element
svg.call(zoom);

// Function to handle zooming and panning
function zoomed() {
    // Get the current transform of the zoom behavior
    const transform = d3.event.transform;
    
    // Update the x and y scales based on the current transform
    const newX = transform.rescaleX(x1);
    const newY = transform.rescaleY(y1);
    
    // Update the axes with the new scales
    g1.select(".x-axis").call(xAxisCall.scale(newX));
    g1.select(".y-axis").call(yAxisCall.scale(newY));
    
    // Update the circles with the new scales
    g1.selectAll(".data-circle")
        .attr("cx", d => newX(d.Attack))
        .attr("cy", d => newY(d.Sp_Atk));
}

// X label
g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", scatterHeight + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Attack");

// Y label
g1.append("text")
    .attr("x", -(scatterHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Special Attack");

// Title
g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", -10)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Special Attack vs Attack (hover to focus)");

// X ticks
const x1 = d3.scaleLinear()
    .domain([0, d3.max(firstData, d => d.Attack)])
    .range([0, scatterWidth]);

// Y ticks
const y1 = d3.scaleLinear()
    .domain([0, d3.max(firstData, d => d.Sp_Atk)])
    .range([scatterHeight, 0]);

const xAxisCall = d3.axisBottom(x1)
    .ticks(7);

g1.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${scatterHeight})`)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

const yAxisCall = d3.axisLeft(y1)
    .ticks(13);
g1.append("g")
    .attr("class", "y-axis")
    .call(yAxisCall);

const rects = g1.selectAll("circle").data(firstData);

// Create legend
const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${scatterMargin.left + scatterWidth + 30}, ${scatterMargin.top + 30})`);

const legendRectSize = 18;
const legendSpacing = 4;

const legendRects = legend.selectAll(".legend-rect")
    .data(Object.keys(typeToColor))
    .enter().append("rect")
    .attr("class", "legend-rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * (legendRectSize + legendSpacing))
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", d => typeToColor[d])
    .on("mouseout", resetOpacity)
    .on("mouseover", highlightLegendColor)

function highlightLegendColor(d) {
    const type = d;
    g1.selectAll(".data-circle")
        .transition()
        .style("opacity", circle => circle.Type_1 === type ? opacityHigh : opacityLow);
}
const legendTexts = legend.selectAll(".legend-text")
    .data(Object.keys(typeToColor))
    .enter().append("text")
    .attr("class", "legend-text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", (d, i) => i * (legendRectSize + legendSpacing) + (legendRectSize / 2))
    .attr("dy", "0.35em")
    .text(d => d);

function resetOpacity() {
    g1.selectAll(".data-circle")
        .transition()
        .style("opacity", opacityHigh);
}

rects.enter().append("circle")
    .attr("cx", d => x1(d.Attack))
    .attr("cy", d => y1(d.Sp_Atk))
    .attr("r", 3)
    .attr("fill", d => typeToColor[d.Type_1])
    .attr("class", "data-circle")
    .on("mouseover", highlightCircle)
    .on("mouseout", resetOpacity);

function highlightCircle(d) {
    g1.selectAll(".data-circle")
        .transition()
        .style("opacity", circle => circle.Type_1 === d.Type_1 ? opacityHigh : opacityLow);
}


    secondData = rawData.map(d => {
        return {
            "Type_1": d.Type_1
        };
    });




// Plot 2: pie chart of each pokemon type (numerical value)
const g2 = svg.append("g")
    .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
    .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
    .attr("transform", `translate(${scatterMargin.left + scatterWidth + legendRectSize + legendSpacing + 150}, ${scatterMargin.top + 30})`);

    
// Title above the pie chart
g2.append("text")
    .attr("x", Math.min(scatterWidth, scatterHeight) / 2)
    .attr("y", -10)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Pokemon Type Distribution");

// Count the occurrences of each Pokémon type
const typeCounts = {};
rawData.forEach(d => {
    const type = d.Type_1;
    if (typeCounts[type]) {
        typeCounts[type]++;
    } else {
        typeCounts[type] = 1;
    }
});

// Convert the counts to an array of objects for the pie layout
const pieData = Object.keys(typeCounts).map(type => {
    return { type: type, count: typeCounts[type] };
});

const pie = d3.pie().value(d => d.count);
const arc = d3.arc().innerRadius(0).outerRadius(Math.min(scatterWidth, scatterHeight) / 2 - 10);

const arcs = g2.selectAll(".arc")
    .data(pie(pieData))
    .enter().append("g")
    .attr("class", "arc")
    .attr("transform", `translate(${Math.min(scatterWidth, scatterHeight) / 2}, ${Math.min(scatterWidth, scatterHeight) / 2})`);

arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => typeToColor[d.data.type]);

// Add legend for the pie chart
const pieLegend = g2.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${Math.min(scatterWidth, scatterHeight) + 40}, 0)`);

const pieLegendRects = pieLegend.selectAll(".legend-rect")
    .data(pieData)
    .enter().append("rect")
    .attr("class", "legend-rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * (legendRectSize + legendSpacing))
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", d => typeToColor[d.type]);

const pieLegendTexts = pieLegend.selectAll(".legend-text")
    .data(pieData)
    .enter().append("text")
    .attr("class", "legend-text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", (d, i) => i * (legendRectSize + legendSpacing) + (legendRectSize / 2))
    .attr("dy", "0.35em")
    .text(d => d.type);



 // Plot 3: Parallel Line chart

// Modify rawData to extract necessary data
const thirdData = rawData.map(d => {
    return {
        "Sp_Atk": +d.Sp_Atk,
        "Attack": +d.Attack,
        "Type_1": d.Type_1,
        "Sp_Def": d.Sp_Def,
        "Defense": d.Defense,
        "Speed": d.Speed,
        "HP": d.HP,
        "Catch_Rate": d.Catch_Rate
    };
});

const scale = 1;

const g4 = svg.append("g")
    .attr("transform", `translate(${scatterMargin.left - 500 + scatterHeight}, ${scatterMargin.top + 100 + scatterHeight * 1.5}) scale(${scale})`);

const parameters = ['HP', 'Attack', 'Defense', 'Sp_Atk', 'Sp_Def', 'Speed', 'Catch_Rate'];

// x axis
const xScale = d3.scalePoint()
    .domain(parameters)
    .range([0, scatterWidth * 5])
    .padding(1)

// Each y axis
const yScale = {};
parameters.forEach(function (parameter) {
    yScale[parameter] = d3.scaleLinear()
        .domain([0, d3.max(thirdData, d => +d[parameter])])
        .range([scatterHeight, 0]);
});

// Function to draw line
function path(d) {
    return d3.line()(parameters.map(function (parameter) { return [xScale(parameter), yScale[parameter](d[parameter])]; }));
}

// Add axes and axis labels
parameters.forEach(function (parameter) {
    g4.append("g")
        .attr("transform", "translate(" + xScale(parameter) + ")")
        .attr("class", "axis")
        .each(function (d) {
            d3.select(this).call(d3.axisLeft().scale(yScale[parameter]));
        })
        .append("text")
        .style("fill", "black")
        .style("font-size", "15px")
        .style("text-anchor", "middle")
        .text(parameter)
        .attr("y", -10);
});

g4.append("text")
    .attr("x", (scatterWidth + 400 + scatterMargin.left + scatterMargin.right))
    .attr("y", scatterMargin.top - 40)
    .style("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Stat Comparison between Pokemon Types");

// Draw lines
g4.selectAll("Line")
    .data(thirdData)
    .enter().append("path")
    .style("fill", "none")
    .attr("d", path)
    .style("stroke", d => typeToColor[d.Type_1])
    .style("opacity", 0.5);

// Create legend
const legend2 = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${scatterWidth + 900 + scatterMargin.left + scatterMargin.right}, ${scatterMargin.top + 500})`);

const legendRects2 = legend2.selectAll(".legend-rect2")
    .data(Object.keys(typeToColor))
    .enter().append("rect")
    .attr("class", "legend-rect2")
    .attr("x", 0)
    .attr("y", (d, i) => i * (legendRectSize + legendSpacing))
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", d => typeToColor[d])
    .on("mouseover", highlightLegendColor2)
    .on("mouseout", resetOpacity2);

const legendTexts2 = legend2.selectAll(".legend-text2")
    .data(Object.keys(typeToColor))
    .enter().append("text")
    .attr("class", "legend-text2")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", (d, i) => i * (legendRectSize + legendSpacing) + (legendRectSize / 2))
    .attr("dy", "0.35em")
    .text(d => d);

function highlightLegendColor2(d) {
    const type = d;
    g4.selectAll("path")
        .transition()
        .style("opacity", line => line.Type_1 === type ? 0.5 : 0.1); // Adjusted opacity values
}

function resetOpacity2() {
    g4.selectAll("path")
        .transition()
        .style("opacity", 0.5); // Reset opacity to 0.5
}


// Added a brush interactive
const brush = d3.brushY()
    .extent([[-30, 30], [10, scatterHeight]])
    .on("brush end", brushed);

g4.selectAll(".brush")
    .data(parameters)
    .enter().append("g")
    .attr("class", "brush")
    .attr("transform", d => "translate(" + xScale(d) + ")")
    .each(function (d) {
        d3.select(this).call(brush);
    })
    .selectAll("rect")
    .attr("x", -8)
    //.transition()
    //.attr('cx', function(d) {
      //return d;
    //})
    .attr("width", 16);
    

function brushed() {
    const actives = [];
    g4.selectAll(".brush")
        .filter(function (d) {
            return d3.brushSelection(this);
        })
        .each(function (d) {
            actives.push({
                dimension: d,
                extent: d3.brushSelection(this)
            });
        });

    const selectedData = thirdData.filter(function (d) {
        if (actives.every(function (active) {
            const dim = active.dimension;
            return active.extent[0] <= yScale[dim](d[dim]) && yScale[dim](d[dim]) <= active.extent[1];
        })) {
            return true;
        }
    });

    // Update lines based on brushed data
g4.selectAll("path")
    .style("display", null) // Ensure all lines are visible initially
    .transition()
    .duration(500) // Set the duration of the transition
    .style("opacity", d => selectedData.includes(d) ? 1 : 0) // Update opacity based on selection
    .on("start", function () {
        d3.select(this).style("display", null); // Ensure line is visible at the start of the transition
    });
}


}).catch(function (error) {
    console.log(error);
});
