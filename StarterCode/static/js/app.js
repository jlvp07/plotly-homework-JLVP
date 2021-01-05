
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
    createBubbleChart(index);
    createGauge(index);
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

function createBubbleChart(index)
{
    sampleData = globalData["samples"][index]

    values = sampleData["sample_values"]
    otus = sampleData["otu_ids"]
    labels  = sampleData["otu_labels"].slice(0,10)
    
    var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 11, 12, 13],
        text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
        mode: 'markers',
        marker: {
          color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
          size: [40, 60, 80, 100]
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Bubble Chart Hover Text',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);
}

function createGauge(index)
{
    sampleData = globalData["metadata"][index]

    var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: sampleData["wfreq"],
          title: { text: "Speed" },
          type: "indicator",
          mode: "gauge",
          gauge: {
            axis: { range: [null, 9] },
            ticks:"",
            steps: [
              { range: [0, 1], color: "rgb(250,50,0)",text: "0-1" },
              { range: [1, 2], color: "rgb(250,100,0)" },
              { range: [2, 3], color: "rgb(250,150,0)" },
              { range: [3, 4], color: "rgb(250,200,0)"},
              { range: [4, 5], color: "rgb(250,250,0)" },
              { range: [5, 6], color: "rgb(200,250,0)"},
              { range: [6, 7], color: "rgb(150,250,0)" },
              { range: [7, 8], color: "rgb(100,250,0)" },
              { range: [8, 9], color: "rgb(50,250,0)"},
            ],
            threshold: {
              line: { color: "green", width: 4 },
              thickness: 0.75,
              value: sampleData["wfreq"]
            }
          }
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);
}