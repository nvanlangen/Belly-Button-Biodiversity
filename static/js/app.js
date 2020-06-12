d3.json("../../samples.json").then((data) => {
    var idArr = [];
    idArr = data.names;
    var idList = d3.select(selDataset);
    for (var i = 0; i < idArr.length; i++) {
        idList.append("option").property("value", idArr[i]).text(idArr[i]);
    }


var values = data.samples[0].sample_values;
var labels = data.samples[0].otu_ids;
var hovertext = data.samples[0].otu_labels;

var barValues = values.slice(0,10).reverse();
var barLabels = labels.slice(0,10).reverse();
var barHovertext = hovertext.slice(0,10).reverse();

var utLabels = [];
for(var i=0; i < 10; i++)
{
   utLabels[i] = "UT " + barLabels[i];
}

var barData = [{
    type: 'bar',
    x: barValues,
    y: utLabels,
    text: barHovertext,
    orientation: 'h'
  }];
  
  Plotly.newPlot('bar', barData);



  var trace1 = {
    x: labels,
    y: values,
    text: hovertext,
    mode: 'markers',
    marker: {
      color: labels,
      size: values
    }
  };
  
  var bubbleData = [trace1];
  
  var layout = {
    showlegend: false,
    height: 600,
    width: 800
  };
  
  Plotly.newPlot('bubble', bubbleData, layout);


var mData = d3.select("#sample-metadata");
var metadata = data.metadata[0];

Object.entries(metadata).forEach(([key, value]) => {
    mData.append("p").text(`${key}: ${value}`);
  });


 
  var gaugeData = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: metadata.wfreq,
		title: { text: "Belly Button Washing Frequency" },
		type: "indicator",
		mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [null, 9] }, 
                         steps: [
                                { range: [0, 1], color: "lightgray" },
                                { range: [1, 2], color: "gray" },
                                { range: [2, 3], color: "lightgray" },
                                { range: [3, 4], color: "gray" },
                                { range: [4, 5], color: "lightgray" },
                                { range: [5, 6], color: "gray" },
                                { range: [6, 7], color: "lightgray" },
                                { range: [7, 8], color: "gray" },
                                { range: [8, 9], color: "gray" }  
                               ]}
}
];

var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', gaugeData, layout);

});  