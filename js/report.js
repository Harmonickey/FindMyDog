// JavaScript Document
var map;

var start_marker = new google.maps.LatLng(42.056918, -87.676703);
var end_marker;

$(function () {
	
	Parse.initialize('5PiDj5mmWu0MlMbqRrSBhqafp4nome88BqM0uvJs', 'ScrtuaWOtSQ2sCpnEPEh8BjpCJhUxSHAm6MLEoMc');
	
});

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) 
	{
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) 
			return c.substring(name.length,c.length);
	}
	return null;
}


function getReportInfo(minTime, maxTime)
{
	var query = new Parse.Query("Dog_Location");
	var lat_long = new Array();
	//if (getCookie('username')!=null) {
		query.select("Location").equalTo("Username", getCookie("username")).lessThanOrEqualTo("Time", maxTime).greaterThanOrEqualTo("Time", minTime).descending("Time").find({
		  success: function(results) {
			for (var i = 0; i < results.length; i++)
			{
				var latitude = results[i].attributes.Location._latitude;
				var longitude = results[i].attributes.Location._longitude;
				lat_long.push({'latitude': latitude, 'longitude': longitude});
				if(i==results.length-1){
					drawRoute(lat_long);
					console.log(lat_long);
				}
			}
		  },
		  error: function(error) {
			console.log("Cannot get info from Parse");
		  }
		});	
	//}
}

function calculateDist(minTime, maxTime)
{
	var dist = 0;
	var lat_long = getReportInfo(minTime, maxTime);
	
	for (var i = 1; i < lat_long.length; i++)
	{
		var lat = parseInt(lat_long[i - 1]['latitude']) - parseInt(lat_long[i]['latitude']);
		var lng = parseInt(lat_long[i - 1]['longitude']) - parseInt(lat_long[i]['longitude']);
		var d = lat * lat + lng * lng;
		dist = dist + Math.sqrt(d);
	}
	return dist;
}

function createActivityMap() {
	var mapOptions = {
		zoom: 17,
		center: start_marker
	}

	map = new google.maps.Map(document.getElementById('activity-map'),
		mapOptions);

	//var result = getReportInfo("1:00", "24:00");

	var date = new Date();
	console.log(date);
	var millTime2 = date.getTime();
	console.log(millTime2);
	millTime1 = millTime2 - (10*24*3600*1000);
	console.log(millTime1);

	getReportInfo(millTime1, millTime2);
	return;
}

function drawRoute(result) {
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
}

google.maps.event.addDomListener(window, 'load', createActivityMap);



