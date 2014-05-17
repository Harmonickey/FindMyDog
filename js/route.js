var map;

var start_marker = new google.maps.LatLng(42.056918, -87.676703);
var end_marker;

function createActivityMap() {
	var mapOptions = {
		zoom: 17,
		center: start_marker
	}

	map = new google.maps.Map(document.getElementById('activity-map'),
		mapOptions);

	//var result = getReportInfo("1:00", "24:00");

	var result = [{'latitude': 49.47805, 'longitude': -123.84716}, {'latitude': 49.47805, 'longitude': -123.84800}, 
	{'latitude': 49.47850, 'longitude': -123.84800}, {'latitude': 49.47900, 'longitude': -123.84850}];

	for(var i=1; i<result.length; i++) {
		var point1 = new google.maps.LatLng(result[i-1]['latitude'], result[i-1]['longitude']);
		var point2 = new google.maps.LatLng(result[i]['latitude'], result[i]['longitude']);
		var line_seg = new google.maps.Polyline({
			path: [point1, point2],
			geodesic: true,
			strokeColor: '#008f8F',
			strokeWeight: 3,
			strokeOpacity: 0.8
		});
		line_seg.setMap(map);
		if(i==1) {
			var start = new google.maps.Marker({
				position: point1,
				map: map,
				title: "Starting Location",
				icon: 'images/letter_s.png',
				animation: google.maps.Animation.DROP
			});
			map.setCenter(point1);
		}
		if(i==result.length-1) {
			var end = new google.maps.Marker({
				position: point2,
				map: map,
				title: "Starting Location",
				icon: 'images/letter_e.png',
				animation: google.maps.Animation.DROP
			});
		}
	}
	return;
}

google.maps.event.addDomListener(window, 'load', createActivityMap);


