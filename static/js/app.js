// Function: init
// Called when the page is opened
function init() {
  // Reads the data from sample.json file
  d3.json("../samples.json").then((data) => {
    // Populates the Subject ID dropdown using an index for the value and name/id for the text
    var idArr = [];
    idArr = data.names;
    var idList = d3.select(selDataset);
    for (var i = 0; i < idArr.length; i++) {
      idList.append("option").property("value", i).text(idArr[i]);
    }

    // Gets the data for the first Subject ID using index 0
    var values = data.samples[0].sample_values;
    var labels = data.samples[0].otu_ids;
    var hovertext = data.samples[0].otu_labels;

    // Slices the data to create arrays of 10 values used in the bar chart, data is already sorted by sample_values in desc order
    // reverses the data to place the greatest values at the top of the horizontal bar chart
    var barValues = values.slice(0, 10).reverse();
    var barLabels = labels.slice(0, 10).reverse();
    var barHovertext = hovertext.slice(0, 10).reverse();

    // Formats horizontal bar chart label to include UT as a prefix
    var utLabels = [];
    for (var i = 0; i < 10; i++) {
      utLabels[i] = "UT " + barLabels[i];
    }

    // Configures horizontal bar chart for the top 10 sample values 
    var barData = [{
      type: 'bar',
      x: barValues,
      y: utLabels,
      text: barHovertext,
      orientation: 'h'
    }];

    // Plots the chart on the web page
    Plotly.newPlot('bar', barData);

    // Configures bubble chart for all data samples
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

    // Configures layout for bubble chart
    var bubbleLayout = {
      showlegend: false,
      height: 600,
      width: 1000,
      xaxis: { title: "OTU ID" }
    };

    // Plots bubble chart on web page
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Sets a variable identifying the #sample-metadata element on the web page
    var mData = d3.select("#sample-metadata");
    // Sets a variable containing the metadata for the first record
    var metadata = data.metadata[0];

    // Traverses each key-value pair in metadata and appends a paragraph with that data to the web page
    Object.entries(metadata).forEach(([key, value]) => {
      mData.append("p").text(`${key}: ${value}`);
    });

    // Configures a pie chart to be used with a gauge
    // Sets 10 sections with 9 of them comprising half of the pie and the 10th being an invisible bottom half
    // Using default colors for the 9 visible sections
    // Seting a hole value to allow a pointer to be set
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

    // Calculates the degree to use based on the hand washing frequency value.  
    // Each value is 20 degrees so the value will be from 0 to 180 inclusive.
    // Center point of the circle is .5,.5 and has a radius of .3
    // Use the degree value to calculate radians which will be used along with sin and cos to determine x,y element of the value
    var degrees = 180 - 20 * metadata.wfreq;
    var radius = .3;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians) + 0.5;
    var y = radius * Math.sin(radians) + 0.5;

    // Sets a radius for a small circle at .5,.5 
    var innerRadius = 0.02;

    // Calculates two points on the small circle that will become a perpendicular line to the pointer
    var innerDegrees1 = degrees + 90;
    var innerRadians1 = innerDegrees1 * Math.PI / 180;
    var innerX0 = innerRadius * Math.cos(innerRadians1) + 0.5;
    var innerY0 = innerRadius * Math.sin(innerRadians1) + 0.5;

    var innerDegrees2 = degrees - 90;
    var innerRadians2 = innerDegrees2 * Math.PI / 180;
    var innerX1 = innerRadius * Math.cos(innerRadians2) + 0.5;
    var innerY1 = innerRadius * Math.sin(innerRadians2) + 0.5;

    // Configures the pointer to the Hand Washing Frequency value
    // A small circle will be displayed around the .5,.5 point
    // Three lines will be used to create a triangle.  The first line is from the previous calculations to create a perpendicular line to the actual point.
    // The other two lines will connect to the value point from each of the two points on the small circle.
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
          x0: innerX0,
          y0: innerY0,
          x1: innerX1,
          y1: innerY1,
          line: {
            color: 'red',
            width: 3
          }
        },
        {
          type: 'line',
          x0: innerX0,
          y0: innerY0,
          x1: x,
          y1: y,
          line: {
            color: 'red',
            width: 3
          }
        },
        {
          type: 'line',
          x0: innerX1,
          y0: innerY1,
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

    // Plot the gauge on the web page
    Plotly.newPlot('gauge', traceGauge, gaugeLayout, { modeBarButtons: [["toImage"]] });
  });
}

// Function: optionChanged
// Parameter: selectValue - The value from the Subject ID drop down
// Called when the drop down value has changed. Gets data for the new selection and reformats all charts and data on the web page. 
function optionChanged(selectValue) {
  d3.json("samples.json").then((data) => {

    // Filter data by matching id for samples to the selectValue
    var values = data.samples[selectValue].sample_values;
    var labels = data.samples[selectValue].otu_ids;
    var hovertext = data.samples[selectValue].otu_labels;

    // Slices the data to create arrays of 10 values used in the bar chart, data is already sorted by sample_values in desc order
    // reverses the data to place the greatest values at the top of the horizontal bar chart
    var barValues = values.slice(0, 10).reverse();
    var barLabels = labels.slice(0, 10).reverse();
    var barHovertext = hovertext.slice(0, 10).reverse();

    // Formats horizontal bar chart label to include UT as a prefix
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
    // Clear element on the web page
    mData.html("");

    // Traverses each key-value pair in metadata and appends a paragraph with that data to the web page
    Object.entries(metadata).forEach(([key, value]) => {
      mData.append("p").text(`${key}: ${value}`);
    });

    // Same calculation as in the init function
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
    var innerX0 = innerRadius * Math.cos(innerRadians1) + 0.5;
    var innerY0 = innerRadius * Math.sin(innerRadians1) + 0.5;

    var innerRadians2 = innerDegrees2 * Math.PI / 180;
    var innerX1 = innerRadius * Math.cos(innerRadians2) + 0.5;
    var innerY1 = innerRadius * Math.sin(innerRadians2) + 0.5;

    // Configure the points for the selected Subject ID
    var update = {
      'shapes[1].x1': innerX1,
      'shapes[1].y1': innerY1,
      'shapes[2].x1': x,
      'shapes[2].y1': y,
      'shapes[3].x1': x,
      'shapes[3].y1': y,
      'shapes[1].x0': innerX0,
      'shapes[1].y0': innerY0,
      'shapes[2].x0': innerX0,
      'shapes[2].y0': innerY0,
      'shapes[3].x0': innerX1,
      'shapes[3].y0': innerY1
    };

    // Plot the gauge on the web page using relayout
    Plotly.relayout("gauge", update);

  });
}

// Call init when the web page is opened
init();