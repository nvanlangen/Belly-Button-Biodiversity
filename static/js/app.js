function init() {
  d3.json("../../samples.json").then((data) => {
    var idArr = [];
    idArr = data.names;
    var idList = d3.select(selDataset);
    for (var i = 0; i < idArr.length; i++) {
      idList.append("option").property("value", i).text(idArr[i]);
    }


    var values = data.samples[0].sample_values;
    var labels = data.samples[0].otu_ids;
    var hovertext = data.samples[0].otu_labels;

    var barValues = values.slice(0, 10).reverse();
    var barLabels = labels.slice(0, 10).reverse();
    var barHovertext = hovertext.slice(0, 10).reverse();

    var utLabels = [];
    for (var i = 0; i < 10; i++) {
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

    var bubbleData = [{
      x: labels,
      y: values,
      text: hovertext,
      mode: 'markers',
      marker: {
        color: labels,
        size: values
      }
    }];

    var bubbleLayout = {
      showlegend: false,
      height: 600,
      width: 1000,
      xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    var mData = d3.select("#sample-metadata");
    var metadata = data.metadata[0];

    Object.entries(metadata).forEach(([key, value]) => {
      mData.append("p").text(`${key}: ${value}`);
    });

    //half pie
    var traceGauge = [{
      type: 'pie',
      showlegend: false,
      hole: 0.6,
      rotation: 90,
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
      text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
      direction: 'clockwise',
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['', '', '', '', '', '', '', '', '', 'white'],
        labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
        hoverinfo: 'labels'
      }
    }];

    // needle
    var degrees = 180 - 20 * metadata.wfreq;
    var radius = .3;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians) + 0.5;
    var y = radius * Math.sin(radians) + 0.5;

    var innerDegrees1 = degrees + 90;
    var innerDegrees2 = degrees - 90;
    var innerRadius = 0.02;

    var innerRadians1 = innerDegrees1 * Math.PI / 180;
    var innerx1 = innerRadius * Math.cos(innerRadians1) + 0.5;
    var innery1 = innerRadius * Math.sin(innerRadians1) + 0.5;

    var innerRadians2 = innerDegrees2 * Math.PI / 180;
    var innerx2 = innerRadius * Math.cos(innerRadians2) + 0.5;
    var innery2 = innerRadius * Math.sin(innerRadians2) + 0.5;

    console.log(x, y, degrees, radians);
    var gaugeLayout = {
      shapes: [
      {
        type: 'circle',
        x0: 0.47,
        y0: 0.47,
        x1: 0.53,
        y1: 0.53,
        fillcolor: 'red',
        line: {
          color: 'red',
          width: 3
        }
      },
      {
        type: 'line',
        x0: innerx1,
        y0: innery1,
        x1: innerx2,
        y1: innery2,
        line: {
          color: 'red',
          width: 3
        }
      },
      {
        type: 'line',
        x0: innerx1,
        y0: innery1,
        x1: x,
        y1: y,
        line: {
          color: 'red',
          width: 3
        }
      },
      {
        type: 'line',
        x0: innerx2,
        y0: innery2,
        x1: x,
        y1: y,
        line: {
          color: 'red',
          width: 3
        }
      }],
      title: '<b>Belly Button Washing Frequency</b><br>Scrubs Per Week',
      hovermode: false,
      width: 500,
      height: 500
    }

    Plotly.newPlot('gauge', traceGauge, gaugeLayout, { modeBarButtons: [["toImage"]] });
  });
}

function optionChanged(selectValue) {
  d3.json("samples.json").then((data) => {
    // Filter data by matching id for samples to the selectValue

    var values = data.samples[selectValue].sample_values;
    var labels = data.samples[selectValue].otu_ids;
    var hovertext = data.samples[selectValue].otu_labels;

    var barValues = values.slice(0, 10).reverse();
    var barLabels = labels.slice(0, 10).reverse();
    var barHovertext = hovertext.slice(0, 10).reverse();

    var utLabels = [];
    for (var i = 0; i < 10; i++) {
      utLabels[i] = "UT " + barLabels[i];
    }

    // Update values for barchart
    // Use restyle to update bar chart
    Plotly.restyle("bar", "x", [barValues]);
    Plotly.restyle("bar", "y", [utLabels]);
    Plotly.restyle("bar", "text", [barHovertext]);

    // Update values for bubbleplot
    // Use restyle to update bubbleplot
    Plotly.restyle("bubble", "x", [labels]);
    Plotly.restyle("bubble", "y", [values]);
    Plotly.restyle("bubble", "text", [hovertext]);


    // Build metadata based on the filter
    var mData = d3.select("#sample-metadata");
    var metadata = data.metadata[selectValue];
    mData.html("");

    Object.entries(metadata).forEach(([key, value]) => {
      mData.append("p").text(`${key}: ${value}`);
    });

    //halfpie
    var degrees = 180 - 20 * metadata.wfreq;
    var radius = .3;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians) + 0.5;
    var y = radius * Math.sin(radians) + 0.5;
    console.log(x, y, degrees, radians);

    var innerDegrees1 = degrees + 90;
    var innerDegrees2 = degrees - 90;
    var innerRadius = 0.02;

    var innerRadians1 = innerDegrees1 * Math.PI / 180;
    var innerx1 = innerRadius * Math.cos(innerRadians1) + 0.5;
    var innery1 = innerRadius * Math.sin(innerRadians1) + 0.5;

    var innerRadians2 = innerDegrees2 * Math.PI / 180;
    var innerx2 = innerRadius * Math.cos(innerRadians2) + 0.5;
    var innery2 = innerRadius * Math.sin(innerRadians2) + 0.5;

    var update = {
      'shapes[1].x1': innerx2,
      'shapes[1].y1': innery2,
      'shapes[2].x1': x,
      'shapes[2].y1': y,
      'shapes[3].x1': x,
      'shapes[3].y1': y,
      'shapes[1].x0': innerx1,
      'shapes[1].y0': innery1,
      'shapes[2].x0': innerx1,
      'shapes[2].y0': innery1,
      'shapes[3].x0': innerx2,
      'shapes[3].y0': innery2
    };

    Plotly.relayout("gauge", update);

  });
}

init();