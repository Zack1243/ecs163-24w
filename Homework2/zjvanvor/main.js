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
    firstData = rawData.filter(d => d.Type_1 === "Psychic" || d.Type_2 === "Psychic").map(d => {
        return {
            "Sp_Atk": +d.Sp_Atk,
            "Attack": +d.Attack
        };
    });
    console.log(firstData);

    //plot 1
    const svg = d3.select("svg");

    const g1 = svg.append("g")
        .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
        .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
        .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`);

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
        .attr("transform", `translate(0, ${scatterHeight})`)
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    const yAxisCall = d3.axisLeft(y1)
        .ticks(13);
    g1.append("g").call(yAxisCall);

    const rects = g1.selectAll("circle").data(firstData);

    rects.enter().append("circle")
        .attr("cx", function (d) {
            return x1(d.Attack);
        })
        .attr("cy", function (d) {
            return y1(d.Sp_Atk);
        })
        .attr("r", 3)
        .attr("fill", '#F85888');









}).catch(function (error) {
    console.log(error);
});
