
//Step 1) Using D3 to read json file
d3.json("samples.json").then(doTheThing);
let globalData = 0

function doTheThing(jsonData)
{
    globalData = jsonData;
    loadTestIds();
    optionChanged(0); //Loads all charts for the first Subject ID
}

function loadTestIds()
{
    var select = d3.select("#selDataset")
    
    select.selectAll("option")
    .data(globalData["names"]) //Take all of these name values (940,941,942,etc.)
    .enter()
      .append("option") //... and create a new option for each of them
      .attr("value", function (v,i) { return i; }) //Using the index as the value
      .text(function (v,i) { return v; }); //...and the value as the option text
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
    .data(d3.keys(sampleData)) //Convert keys in samplesData to array
    .text(function (v,k) { return v + ": " + sampleData[v]; }); //Print keys and their values
}

function createBarChart(index)
{
    //Get the sample data for the selected Subject ID index
    sampleData = globalData["samples"][index]

    //Get Top 10 (first 10) of each of the required arrays
    values = sampleData["sample_values"].slice(0,10)
    otus = sampleData["otu_ids"].slice(0,10).map(x => "OTU " + x)
    labels  = sampleData["otu_labels"].slice(0,10)

    //Create/setup bar chart data
        var barData = [{
            type: 'bar',
            x: values,
            y: otus,
            text: labels,
            orientation: 'h'
          }];
          
          var layout = {
            //title: 'Bubble Chart Hover Text',
            showlegend: false,
            height: 400,
            width: getDivWidth("body")*0.3,
        };
        //Pass data and layout to Plotly   
          Plotly.newPlot('bar', barData,layout);
}

function createBubbleChart(index)
{
    sampleData = globalData["samples"][index]

    values = sampleData["sample_values"]
    otus = sampleData["otu_ids"]
    labels  = sampleData["otu_labels"]
    
    desired_maximum_marker_size = 100;
    maxVal = values[0] //The first value is always the largest

    var data = [{
        x: otus,
        y: values,
        text: labels,
        mode: 'markers',
        marker: {
          color: otus,
          colorscale: "Rainbow",
          size: values,
          //Makes the largest bubble a standard size and all other bubbles scaled relative to the biggest one
          sizeref: 2.0 * maxVal / (desired_maximum_marker_size**2),
            sizemode: 'area'
        }
      }];
            
      var layout = {
        //title: 'Bubble Chart Hover Text',
        showlegend: false,
        height: 600,
        width: getDivWidth("body")*0.7
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
          title: { 
              text: "Scrubs Per Week",
              font:{
                size: 28,
                }
            },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            ticks:"",
            bar: { color: "blue" },
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
              line: { color: "blue", width: 4 },
              thickness: 0.75,
              value: sampleData["wfreq"]
            }
          }
        }
      ];
      
      var layout = { 
          width: getDivWidth("body") * 0.3, 
          height: 450,
          margin: { t:0}
        };
      Plotly.newPlot('gauge', data, layout);
}

//Helper function to get body width
// get the dom element width
function getDivWidth (div) {
    var width = d3.select(div)
      // get the width of div element
      .style('width')
      // take of 'px'
      .slice(0, -2)
    // return as an integer
    return Math.round(Number(width))
  }