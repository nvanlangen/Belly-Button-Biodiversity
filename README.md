# Belly-Button-Biodiversity

## Initial Steps

- Read in samples.json file that contained data for the plots

- Populated a dropdown list using Subject ID

- Populated arrays of Values, OTU IDs, and OTU Descriptions for the first subject in the data

## Created Horizontal Bar Chart

- Since the data was sorted in descending by value for each subject, used the slice method to get the top 10 Values, OTU IDs, and OTU Descriptions.

- Reversed the arrays so they can be displayed with the greatest value at top of the horizontal bar chart

- Configured and plotted the chart

## Created Bubble Chart

- Using the arrays generated in the initialization, created a bubble chart that displayed relative values for all OTUs for the subject.

- Higher values were shown with larger circles and circles were colored using the OTU ID.

## Displayed Subject Metadata

- Selected metadata from the data provided for the subject

- Traversed each key-value pair and displayed the information

## Created Gauge Chart

- A gauge chart was created to show the hand washing frequency for a subject.

- A pie chart was used to show the frequencies from 0 to 9 on the top half of the chart.  The bottom half of the chart was not used and was changed to white.  The hole attribute was used to create an empty half circle.  A small circle was created in the center of the pie chart and three coordinates were calculated to make a triangle pointer to the hand washing frequency value.  The coordinates were calculated using sin and cos based on the angle needed to point to the value.

## Selecting Different Subject ID

- An event handler was used to redisplay the 4 charts above for the selected subject each time a new subject was selected.


