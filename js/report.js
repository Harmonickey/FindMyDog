// JavaScript Document
var map;

var start_marker = new google.maps.LatLng(42.056918, -87.676703);
var end_marker;

$(function () {
	
	Parse.initialize('5PiDj5mmWu0MlMbqRrSBhqafp4nome88BqM0uvJs', 'ScrtuaWOtSQ2sCpnEPEh8BjpCJhUxSHAm6MLEoMc');
	
	getTodayReport();
});

function getTodayReport()
{
	var date = new Date();
	
	var yymmdd = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	
	$("#title").html("Report: " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
	
	//get midnight of last night
	var normalizedToday = new Date(yymmdd);
	var min = normalizedToday.getTime();
	
	//get midnight of tonight
	normalizedToday.setDate(normalizedToday.getDate() + 1);
	var max = normalizedToday.getTime();
	
	getReportInfo(min, max);
}

function getYesterdayReport()
{
	var date = new Date();
	
	var yymmdd = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	
	//get midnight of last night
	var normalizedToday = new Date(yymmdd);
	var max = normalizedToday.getTime();
	
	//get midnight of tonight
	normalizedToday.setDate(normalizedToday.getDate() - 1);
	var min = normalizedToday.getTime();
	
	$("#title").html("Report: " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
	
	getReportInfo(min, max);
}

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
	if (getCookie('username')!=null) {
		query.select("Location").equalTo("Username", getCookie('username')).lessThanOrEqualTo("Time", maxTime).greaterThanOrEqualTo("Time", minTime).descending("Time").limit(1000).find({
		  success: function(results) {
			var lat_long = new Array();
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
			var totalDistance = 0;
			for (var i = 0; i < lat_long.length - 1; i++)
			{
				var src = new google.maps.LatLng(lat_long[i].latitude, lat_long[i].longitude);
				var dest = new google.maps.LatLng(lat_long[i + 1].latitude, lat_long[i + 1].longitude);
				totalDistance += getDistance(src, dest);
			}
			
			var miles = (totalDistance / 5280).toFixed(2);
			
			$("#distance").html(miles);
			
			var milesperhour = (miles / 24).toFixed(2);
			
			$("#speed").html(milesperhour);
		  },
		  error: function(error) {
			console.log("Cannot get info from Parse");
		  }
		});	
	}	
}

function getDistance(loc, pos) {
  //calculate distance in meters
  var d = google.maps.geometry.spherical.computeDistanceBetween(loc, pos);
  return 3.28084*d; //convert to feet
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
				title: "Ending Location",
				icon: 'images/letter_e.png',
				animation: google.maps.Animation.DROP
			});
		}
		if(i==result.length-1) {
			var end = new google.maps.Marker({
				position: point2,
				map: map,
				title: "Starting Location",
				icon: 'images/letter_s.png',
				animation: google.maps.Animation.DROP
			});
			map.setCenter(point2);
		}
	}
}

google.maps.event.addDomListener(window, 'load', createActivityMap);



