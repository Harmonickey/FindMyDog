var myDataRef = new Firebase('https://findmydeardog.firebaseio.com/');

var map; //will be used for map on page
var username;
var password;

var logged_in = false;

var dog_marker; //used to mark the location of the dog_marker
var positions = [];
var max = 5;
var line1, line2, line3, line4;

function initializeTracker(user, pass) {
  username = user;
  password = pass;
  getUserFromFirebase(username, password, 'login');
  //get original geolocation
  if(navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  		updateFirebaseLocation(position.coords.latitude, position.coords.longitude);
  		//options for the displayed map
		var mapOptions = {
			zoom: 20,
			center: pos
		}
		//create the map
		map = new google.maps.Map(document.getElementById('tracking-map'),
		  	mapOptions);
  		dog_marker = new google.maps.Marker( {
  			position: pos,
  			map: map,
  			title: "Dog's Location",
  			icon: "images/pets2.png"
  		});

  		logged_in = true;

  		line1 = new google.maps.Polyline({
  			geodesic: true,
  			strokeColor: '#008f8f',
  			strokeOpacity: 0.5,
  			strokeWeight: 3
  		});
  		line2 = new google.maps.Polyline({
  			geodesic: true,
  			strokeColor: '#008f8f',
  			strokeOpacity: 0.5,
  			strokeWeight: 3
  		});
  		line3 = new google.maps.Polyline({
  			geodesic: true,
  			strokeColor: '#008f8f',
  			strokeOpacity: 0.5,
  			strokeWeight: 3
  		});
  		line4 = new google.maps.Polyline({
  			geodesic: true,
  			strokeColor: '#008f8f',
  			strokeOpacity: 0.5,
  			strokeWeight: 3
  		});

  		line1.setMap(map);
  		line2.setMap(map);
  		line3.setMap(map);
  		line4.setMap(map);
  	});
  }
}

setInterval(trackLocation, 5000);

function trackLocation() {
	if(logged_in==true) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  			updateFirebaseLocation(position.coords.latitude, position.coords.longitude);
			dog_marker.setPosition(pos);	
			map.setCenter(pos);
			if (positions.length < max) {
				positions.unshift(pos);
			}
			else {
				positions.pop();
				positions.unshift(pos);
			}

			if (positions.length >= 2) {
				line1.setPath([positions[0], positions[1]]);
				console.log(positions[0]);
				console.log(positions[1]);
			}
			if (positions.length >= 3) {
				line2.setPath([positions[1], positions[2]]);
				console.log(positions[2]);
			}
			if (positions.length >= 4) {
				line3.setPath([positions[2], positions[3]]);
				console.log(positions[3]);
			}
			if (positions.length == 5) {
				line4.setPath([positions[3], positions[4]]);
				console.log(positions[4]);
				console.log("-----");
			}
		});
	}
}

function updateFirebaseLocation(lat, lng) {
	myDataRef.child('user').child(username).update({
		'dogLat': lat,
		'dogLng': lng
	});
}

function setError(error, module)
{
	switch (module) {
		case 'login':
			$("#login_error").css('display', 'block');
			if (error == 'no_user')
				$("#login_error").html("Username not found");
			else if (error == 'no_pass')
				$("#login_error").html("Password not correct");		
		case 'register':
			$("#register_error").css('display', 'block');
			if (error == 'no_user')
				$("#register_error").html("Username already taken");
		case 'mainscreen':
	}
}

