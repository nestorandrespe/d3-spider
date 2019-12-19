(function ($, root, undefined) {
	
	var svg = d3.select('#canvas');
	var gBarras = svg.append('g').attr('class', 'gBarras');

	var keys = [];
	var data = [];

	var randomNum = Math.floor(Math.random() * 20) + 6;
	for(var i = 0; i < randomNum; i++){
		keys.push(i + '_num');
	}

	for(var i = 0; i < 2; i++){
		var obj = {};
		obj.name = 'grupo ' + i;

		for(var j = 0; j < keys.length; j++){
			obj[keys[j]] = Math.floor(Math.random() * 10) + 1;
		}
		
		data.push(obj);
	}

	var args = {
		"radius": 400,
		"width": 1000,
		"height": 500,
		"unit": '%'
	};
	// console.log(data);
	var spider = new SpiderChart(gBarras, data, keys, args);
	spider.dibujar();

})(jQuery, this);