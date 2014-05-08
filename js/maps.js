var map;
//var static_loc = new google.maps.LatLng(41.878852, -87.636478);
var slat = 42.056918;
var slong = -87.676703;
var static_loc = new google.maps.LatLng(42.056918, -87.676703);
var dog;

function initialize() {

  var mapOptions = {
  	zoom: 18,
  	center: static_loc
  }

  map = new google.maps.Map(document.getElementById('map-canvas'),
  	mapOptions);

  if(navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  		dog = new google.maps.Marker( {
  			position: pos,
  			map: map,
  			title: "My Location"
  		});
  	});
  }

  var static_marker = new google.maps.Marker({
  	position: static_loc,
  	map: map,
  	title: "Home",
  });

  var static_circle = new google.maps.Circle({
  	map: map,
  	radius: 60,
  	fillColor: '#AA0000',
  	strokeWeight: 1,
  });
  static_circle.bindTo('center', static_marker, 'position');

}

setInterval(trackLocation, 3000);

function trackLocation() {
  //console.log("Updating location");
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    getDistance(static_loc, pos);
  	dog.setPosition(pos);
  });
}

var dist_matrix = new google.maps.DistanceMatrixService();

function getDistance(loc, pos) {

	dist_matrix.getDistanceMatrix({
		origins: [loc],
		destinations: [pos],
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		travelMode: google.maps.TravelMode.WALKING
	}, callback);
}

function callback(response, status) {
	console.log(response);
	if (status==google.maps.DistanceMatrixStatus.OK) {
		var dist = response.rows[0].elements[0].distance.value;
		//dist = 3.28084*parseFloat(dist);
		console.log("Distance: " + String(dist));
	}
}

	/*var url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins="
	+ String(clat) + "," + String(clong) + "&destinations=" + String(dlat) + ","
	+ String(dlong) + "&sensor=false&unit=imperial&key=AIzaSyAjECgtOkJf0xeIpProlCseMUfh4VF6jGg";*/

google.maps.event.addDomListener(window, 'load', initialize);




