// Define the URL for the JSON data
const dataUrl = "file:///Users/nmfidler/Desktop/Module%2014%20challenge/StarterCode/index.html";

// Function to create the bar chart
function createBarChart(sampleData) {
    const top10 = sampleData.slice(0, 10);

    const svgWidth = 800;
    const svgHeight = 400;

    const margin = { top: 20, right: 20, bottom: 30, left: 200 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chartContainer")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const yScale = d3.scaleBand()
        .range([0, chartHeight])
        .domain(top10.map(d => d.otu_ids))
        .padding(0.1);

    const xScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([0, d3.max(top10, d => d.sample_values)]);

    const yAxis = d3.axisLeft(yScale);
    chart.append("g")
        .call(yAxis);

    const bars = chart.selectAll(".bar")
        .data(top10)
        .enter()
        .append("g")
        .attr("class", "bar");

    bars.append("rect")
        .attr("y", d => yScale(d.otu_ids))
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.sample_values))
        .attr("fill", "steelblue");

    bars.append("text")
        .attr("x", d => xScale(d.sample_values) - 5)
        .attr("y", d => yScale(d.otu_ids) + yScale.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => d.otu_labels)
        .attr("fill", "white")
        .attr("text-anchor", "end");
}

// Function to create the bubble chart
function createBubbleChart(sampleData) {
    const svgWidth = 800;
    const svgHeight = 400;

    const svg = d3.select("#chartContainer")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(sampleData, d => d.otu_ids)])
        .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(sampleData, d => d.sample_values)])
        .range([chartHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const sizeScale = d3.scaleLinear()
        .domain([0, d3.max(sampleData, d => d.sample_values)])
        .range([2, 20]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    chart.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chart.append("g")
        .call(yAxis);

    chart.selectAll("circle")
        .data(sampleData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.otu_ids))
        .attr("cy", d => yScale(d.sample_values))
        .attr("r", d => sizeScale(d.sample_values))
        .attr("fill", d => colorScale(d.otu_ids))
        .append("title")
        .text(d => d.otu_labels);
}

// Function to populate the dropdown menu
function populateDropdown(sampleNames) {
    const dropdown = d3.select("#sampleDropdown");

    dropdown.selectAll("option")
        .data(sampleNames)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
}

// Function to display sample metadata
function displayMetadata(metadata) {
    const metadataContainer = d3.select("#metadataContainer");
    metadataContainer.html(""); // Clear previous metadata

    const metadataList = metadataContainer.append("ul");

    Object.entries(metadata).forEach(([key, value]) => {
        metadataList.append("li").text(`${key}: ${value}`);
    });
}

// Function to handle dropdown change
function dropdownChange() {
    const selectedSample = d3.select("#sampleDropdown").property("value");
    d3.json(dataUrl)
        .then(data => {
            const sampleData = data.samples.find(sample => sample.id === selectedSample);
            const sampleMetadata = data.metadata.find(item => item.id === parseInt(selectedSample));
            createBarChart(sampleData);
            createBubbleChart(sampleData);
            displayMetadata(sampleMetadata);
        })
        .catch(error => console.error("Error loading data:", error));
}

// Load data and initialize
d3.json(dataUrl)
    .then(data => {
        const sampleNames = data.names;
        populateDropdown(sampleNames);
        const initialSample = sampleNames[0];
        const initialSampleData = data.samples.find(sample => sample.id === initialSample);
        const initialSampleMetadata = data.metadata.find(item => item.id === parseInt(initialSample));
        createBarChart(initialSampleData);
        createBubbleChart(initialSampleData);
        displayMetadata(initialSampleMetadata);
    })
    .catch(error => console.error("Error loading data:", error));

    // Function to display sample metadata
function displayMetadata(metadata) {
    const metadataContainer = d3.select("#metadataContainer");
    metadataContainer.html(""); // Clear previous metadata

    const metadataList = metadataContainer.append("div").attr("class", "metadata-list");

    Object.entries(metadata).forEach(([key, value]) => {
        const metadataItem = metadataList.append("div").attr("class", "metadata-item");
        metadataItem.append("span").text(`${key}: `).attr("class", "metadata-key");
        metadataItem.append("span").text(value).attr("class", "metadata-value");
    });
}
// Function to handle dropdown change
function dropdownChange() {
    const selectedSample = d3.select("#sampleDropdown").property("value");
    d3.json(dataUrl)
        .then(data => {
            // Clear existing charts and metadata
            d3.select("#chartContainer").html("");
            d3.select("#metadataContainer").html("");

            const sampleData = data.samples.find(sample => sample.id === selectedSample);
            const sampleMetadata = data.metadata.find(item => item.id === parseInt(selectedSample));
            createBarChart(sampleData);
            createBubbleChart(sampleData);
            displayMetadata(sampleMetadata);
        })
        .catch(error => console.error("Error loading data:", error));
}


// Listen for dropdown change event
d3.select("#sampleDropdown").on("change", dropdownChange);
