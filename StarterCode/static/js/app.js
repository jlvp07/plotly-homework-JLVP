
d3.json("samples.json").then(doTheThing);
let globalData = 0
function doTheThing(data)
{
    globalData = data;
    loadTestIds();
    optionChanged(0);
}

function loadTestIds()
{
    var select = d3.select("#selDataset")
    
    select.selectAll("option")
    .data(globalData["names"])
    .enter()
      .append("option")
      .attr("value", function (v,i) { return i; })
      .text(function (v,i) { return v; });
}

function optionChanged(index)
{
    loadDemographics(index);
    createBarChart(index);
}

function loadDemographics(index)
{
    sampleData = globalData["metadata"][index]

    var meta = d3.select("#sample-metadata")
    
    meta.selectAll("p")
    .data(d3.keys(sampleData))
    .text(function (v,k) { return v + ": " + sampleData[v]; });
}

function createBarChart(index)
{
    sampleData = globalData["samples"][index]

    values = sampleData["sample_values"].slice(0,10)
    otus = sampleData["otu_ids"].slice(0,10).map(x => "OTU " + x)
    labels  = sampleData["otu_labels"].slice(0,10)
        var barData = [{
            type: 'bar',
            x: values,
            y: otus,
            text: labels,
            orientation: 'h'
          }];
          
          Plotly.newPlot('bar', barData);

}