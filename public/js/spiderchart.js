class SpiderChart {
    constructor(elemT, dataT, keysT){

        this.elem = elemT;
        this.data = dataT;
        this.keys = keysT;

        this.ticks = null;
        this.paths = null;

        this.ticks_num = keysT.length;
        this.ticks_angle = 360 / this.ticks_num;
        this.radius = 400;

        this.rota = 0;

        this.zoom = 15;

        this.tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

        this.scaleLinear = d3.scaleLinear()
        .domain([0,this.zoom])
        .range([0,this.radius]);

        this.color = d3.scaleOrdinal()
        .range(d3.schemePastel1);
        
        console.log(dataT);
    }

    dibujar() {
        this.dibujarLinea();
        this.dibujarPaths();
    }

    dibujarLinea() {
        if(this.ticks != null) this.ticks.remove();
        this.ticks = this.elem.append('g').attr('class', 'ticks')
        .attr('transform', 'translate(960,500) rotate(0)');

        var ticks_group = this.ticks.append('g').attr('class', 'ticks_group');

        var ticks = ticks_group.selectAll('.tick')
        .data(this.keys)
        .enter()
        .append('g')
        .attr('class', 'tick')
        .attr('transform', (d,i)=>{
            return 'rotate('+(i*this.ticks_angle)+')';
        });


        // for(var i = 0; i < this.keys.length; i++){
        //     var group = ticks_group.append('g')
        //     ;

        //     ticks.push(group);
        // }

        for(var j = 1; j < 11; j++){
            this.ticks.append('line')
            .attr('x1', this.scaleLinear(j*1.3))
            .attr('y1', -5)
            .attr('x2', this.scaleLinear(j*1.3))
            .attr('y2', 5)
            .attr('stroke-width', '2')
            .attr('stroke', '#999');

            this.ticks.append('text')
            .attr('x' ,this.scaleLinear(j*1.3))
            .attr('y' , 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', 11)
            .attr('fill', '#999')
            .text((j*1.3).toFixed(2))

            this.ticks.append('circle')
            .attr('fill', 'none')
            .attr('class', 'ticks_line')
            .attr('stroke', '#333')
            .attr('stroke-width', 0.25)
            .attr('r', this.scaleLinear(j*1.3));
        }

        ticks
        .append('line')
        .attr('x1', 0)
        .attr('x2', this.radius)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', '#dcdcdc');

        ticks
        .append('text')
        .attr('class', 'keylegend')
        .attr('text-anchor', 'middle')
        .attr('fill', '#999')
        .attr('font-weight', 'bold')
        .attr('x' ,0)
        .attr('y' , 0)
        .attr('data-index', (d,i)=>{
            return i;
        })
        .text((d,i)=>{
            return this.keys[i];
        })
        .attr('transform', (d,i)=>{
            var angle = this.ticks_angle * i;
            return 'translate( '+this.radius+',-10) rotate(-'+angle+')'
        })
        .on('click', (d,i)=>{
            var angle = -this.ticks_angle * i;
            var rotation = this.rota - angle;
            this.rota = angle;


            if(rotation > 180){
                angle = (360 + angle);
            } else if(rotation < -180) {
                angle = (360 - angle);
            }

            var stepangle = this.ticks_angle;
            // if(Math.abs(angle) > 180) angle = -(360 - angle);
            this.ticks.selectAll('.ticks_group').attr('transform', 'rotate('+angle+')')
            this.paths.attr('transform', 'translate(960,500) rotate('+angle+')')
            this.ticks.selectAll('.keylegend').transition().attr('transform', (d,j)=>{
                var newAngle = stepangle * j + angle;
                // console.log(newAngle);
                return 'translate( '+this.radius+',-10) rotate('+(-1 * newAngle)+')'
            })
        })
        
    }

    dibujarPaths() {
        this.paths = this.elem.append('g').attr('class', 'paths')
        .attr('transform', 'translate(960,500)')

        this.paths.selectAll('.spider_elem')
        .data(this.data)
        .enter()
        .append('g')
        .attr('class','spider_elem')
        .append('path')
        .attr('fill', d => {
            return this.color(d.name)
        })
        .attr('stroke', d => {
            return '#fff'
        })
        .attr('opacity', 0.3)
        .attr('d', (d, i) => {
            var final = '';
            var tooltip = this.tooltip;
            var total = this.zoom;
            for(var i = 0; i < this.keys.length; i++){
                var angle = i * this.ticks_angle;
                var value = d[this.keys[i]];
                angle = angle * (Math.PI / 180);
                var radius = this.scaleLinear(value);
                var xpos = radius * Math.cos(angle);
                var ypos = radius * Math.sin(angle);
                var str = 'L ';
                if(i == 0) str = 'M ';
                str = str + xpos + ',' + ypos + ' ';
                if(i == this.keys.length - 1)
                        str += 'Z';

                    final += str;

                this.paths.append('circle')
                .attr('class', 'circle_dot')
                .attr('fill', () => {
                    return this.color(d.name);
                })
                .attr('stroke', '#fff')
                .attr('cx', xpos)
                .attr('cy', ypos)
                .attr('r', 8)
                .attr('data-value', value)
                .attr('data-key', this.keys[i])
                .on("mouseover", function() {
                    // console.log(this);
                    tooltip.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    tooltip.html('<b>' + d.name + '</b><br>' + this.getAttribute('data-key') + ': ' + this.getAttribute('data-value'))	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 50) + "px");	
                    })					
                .on("mouseout", function(d) {		
                    tooltip.style("opacity", 0);	
                    tooltip.style("left", "-1000px")		
                        .style("top", "-1000px");	
                });
                
                
            }
            return final;
        })
        .attr('class', 'spider_elem');
    }

    updateZoom(zoom) {
       
        
    }
}