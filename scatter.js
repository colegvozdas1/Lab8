d3.csv('driving.csv',d3.autoType).then(data=>{

    let margin = {top:50,bottom: 50, left: 50, right: 50};
    const width = 900 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let xScale = d3.scaleLinear().domain(d3.extent(data,d=>d.miles)).nice()
    .range([0,width])
    let yScale = d3.scaleLinear().domain(d3.extent(data,d=>d.gas)).nice()
    .range([height,0])

    const f = d3.format("$.2f")

    let yAxis = d3.axisLeft()
    .scale(yScale).tickFormat(f)
    let xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(7)

    svg.append("g")
	.attr("class", "axis x-axis")
	.call(xAxis)
    .attr("transform", `translate(0, ${height})`)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
    .attr("y2", -height)
    .attr("stroke-opacity", 0.1))


    svg.append("g")
	.attr("class", "axis y-axis")
	.call(yAxis) 
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1))

    

    let points = svg.selectAll('circle')
    .data(data)
    .enter()
    .append('g')


    points.append('text')
    .attr('class','words')
    .attr('x', d=>xScale(d.miles))
    .attr('y', d=>yScale(d.gas))
    .text(function(d){
       return d.year
    })
    .attr('text-anchor', 'start')
    .attr('font-family','cambria')
    .each(position)
    .call(halo)
    


    points.append('circle')
    .attr('r',5)
    .attr('cx',function(d){
        return xScale(d.miles)
    })
    .attr('cy',function(d){
        return yScale(d.gas)
    })
    .attr('fill','none')
    .attr('stroke','blue')

    const line = d3
    .line()
    .x(d=>xScale(d.miles))
    .y(d=>yScale(d.gas));

    svg.append('path')
    .datum(data)
    .attr('d',line)
    .attr('fill','none')
    .attr('stroke','orangered')
    .attr('stroke-width','3px')
    .attr('stroke-color','orangered')

    svg.append('text')
    .attr('x',width-130)
    .attr('y',height-5)
    .attr('font-weight','bold')
    .text("Miles per Person per Year")
    
    svg.append('text')
    .attr('x',10)
    .attr('y',10)
    .attr('font-weight','bold')
    .text("Cost per Gallon")


    


    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
          case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
          case "right":
            t.attr("dx", "0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "start");
            break;
          case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
          case "left":
            t.attr("dx", "-0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "end");
            break;
        }
      }
      function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }


})