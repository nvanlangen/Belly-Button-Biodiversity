d3.json("../../samples.json").then((data) => {
    console.log(data.names);
    var idArr = [];
    idArr = data.names;
    var idList = d3.select(selDataset);
    for (var i = 0; i < idArr.length; i++) {
        idList.append("option").property("value", idArr[i]).text(idArr[i]);
    }

});


var barData = [{
    type: 'bar',
    x: [20, 14, 23],
    y: ['giraffes', 'orangutans', 'monkeys'],
    orientation: 'h'
  }];
  
  Plotly.newPlot('bar', barData);


  var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 11, 12, 13],
    mode: 'markers',
    marker: {
      size: [40, 60, 80, 100]
    }
  };
  
  var bubbleData = [trace1];
  
  var layout = {
    title: 'Marker Size',
    showlegend: false,
    height: 600,
    width: 600
  };
  
  Plotly.newPlot('bubble', bubbleData, layout);
  

  var gaugeData = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: 270,
		title: { text: "Speed" },
		type: "indicator",
		mode: "gauge+number"
	}
];

var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', gaugeData, layout);
 