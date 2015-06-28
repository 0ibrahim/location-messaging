groupsRef.on("value", function(snapshot) {
	var groups = snapshot.val();
	var groupIDs = [];
	var groupNames = [];
	var viewcounts = [];
	var totalViewcount = 0;
	for(groupID in groups) {
		var viewcount = groups[groupID].viewcount;
		var groupName = groups[groupID].name;

		viewcounts.push(viewcount);
		groupNames.push(groupName);
		groupIDs.push(groupID);
		totalViewcount += viewcount;
	}
	//CHANGE THIS FUNCTION
	function getsize(k)
	{
		if(totalViewcount != 0) {
			return viewcounts[k]/totalViewcount + 0.1;
		}
		else {
			return 0.1;
		}
	}
	var n = viewcounts.length;
		m = n; // number of distinct clusters

	var width = window.innerWidth*0.95,
		height = window.innerHeight*0.95,
		padding = Math.min(width,height)/n, // separation between same-color nodes
		clusterPadding = Math.min(width,height)/m, // separation between different-color nodes
		maxRadius = (0.05*n)*Math.min(width,height);

	var color = d3.scale.category10()
		.domain(d3.range(m));

	// The largest node for each cluster.
	var clusters = new Array(m);
	var k=0;
	var nodes = d3.range(m).map(function() {
	  var i = k,
		  r = getsize(k)* maxRadius,
		  d = {
			cluster: i,
			radius: r,
			x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
			y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
		  };
	   k++;  
	  clusters[i] = d;
	  return d;
	});

	if(d3.select("body").select("svg").empty()){
		
	var svgContainer = d3.select("body").insert("svg")
                                     .attr("width", width)
                                     .attr("height", height);

    var circles = svgContainer.selectAll("circle")
                           .data(nodes)
                           .enter()
                           .append("circle")
                           .on("click", function(d, i) {
			var viewcountRef = new Firebase(firebaseRefURL + "groups/" + groupIDs[i] + "/viewcount");
			viewcountRef.transaction(function(currentValue) {
				return (currentValue || 0) + 1;
			});
			showGroup(groupIDs[i]);
		});

	var circleAttributes = circles
                       .attr("cx", function (d) { return d.x; })
                       .attr("cy", function (d) { return d.y; })
                       .attr("r", function (d) { return d.radius; })
      					.style("fill", function(d) { return color(d.cluster); })


var text = svgContainer.selectAll("text")
                       .data(nodes)
                        .enter()
                        .append("text");

                        var textLabels = text
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .text( function (d) { return groupNames[d.cluster]; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
				.attr("text-align", "center")
                 .attr("fill", "white");


	var force = d3.layout.force()
		.nodes(nodes)
		.size([width, height])
		.gravity(.02)
		.charge(0)
		.on("tick", tick)
		.start();



	function tick(e) {
	  circles
		  .each(cluster(10 * e.alpha * e.alpha))
		  .each(collide(.5))
		  .attr("cx", function(d) { return d.x; })
		  .attr("cy", function(d) { return d.y; });
	  text
		  .each(cluster(10 * e.alpha * e.alpha))
		  .each(collide(.5))
		  .attr("x", function(d) { return d.x*0.96; })
		  .attr("y", function(d) { return d.y; });
	}

	// Move d to be adjacent to the cluster node.
	function cluster(alpha) {
	  return function(d) {
		var cluster = clusters[d.cluster];
		if (cluster === d) return;
		var x = d.x - cluster.x,
			y = d.y - cluster.y,
			l = Math.sqrt(x * x + y * y),
			r = d.radius + cluster.radius;
		if (l != r) {
		  l = (l - r) / l * alpha;
		  d.x -= x *= l;
		  d.y -= y *= l;
		  cluster.x += x;
		  cluster.y += y;
		}
	  };
	}

	// Resolves collisions between d and all other circles.
	function collide(alpha) {
	  var quadtree = d3.geom.quadtree(nodes);
	  return function(d) {
		var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
			nx1 = d.x - r,
			nx2 = d.x + r,
			ny1 = d.y - r,
			ny2 = d.y + r;
		quadtree.visit(function(quad, x1, y1, x2, y2) {
		  if (quad.point && (quad.point !== d)) {
			var x = d.x - quad.point.x,
				y = d.y - quad.point.y,
				l = Math.sqrt(x * x + y * y),
				r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
			if (l < r) {
			  l = (l - r) / l * alpha;
			  d.x -= x *= l;
			  d.y -= y *= l;
			  quad.point.x += x;
			  quad.point.y += y;
			}
		  }
		  return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		});
	  };
	}
}
}, function(errorObject) {
	console.log(errorObject.code);
});