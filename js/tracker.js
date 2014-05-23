var myDataRef = new Firebase('https://findmydeardog.firebaseio.com/');
Parse.initialize('5PiDj5mmWu0MlMbqRrSBhqafp4nome88BqM0uvJs', 'ScrtuaWOtSQ2sCpnEPEh8BjpCJhUxSHAm6MLEoMc');

var map; //will be used for map on page

var logged_in = false;

var dog_marker; //used to mark the location of the dog_marker
var positions = [];
var max = 5;
var line1, line2, line3, line4;

function initializeTracker() {
  //get original geolocation
  if(navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		lat = position.coords.latitude;
  		lng = position.coords.longitude;
 // 		var pos = new google.maps.LatLng(lat, lng);
  		updateFirebaseLocation(lat, lng);
  		logged_in = true;
  		$("#user_id").text(getCookie("username"));
  		//options for the displayed map
/*		var mapOptions = {
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
  		line4.setMap(map);*/
  	});
  }
}

setInterval(trackLocation, 1000);

function trackLocation() {
	if(logged_in==true) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  			updateFirebaseLocation(position.coords.latitude, position.coords.longitude);
  			
  			$("#status").text("Transmitting location...");
	/*		dog_marker.setPosition(pos);
			storeDogLocation(positions.coords.latitude, positions.coords.longitude);	
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
			}*/
		});
	}
}

function updateFirebaseLocation(lat, lng) {
	console.log(lat + ',' + lng);
	myDataRef.child('user').child(getCookie("username")).update({
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


function storeDogLocation(lat, lng)
{
	var t = new Date();
	var time = t.getTime();
	
	var DogLocation = Parse.Object.extend("Dog_Location");
	var dogLocation = new DogLocation();
	var location = new Parse.GeoPoint(lat, lng);
	dogLocation.save({
		Username: getCookie("username"),
		Location: location,
		Time: time
	}, {
	success: function(dogLocation) {
	    //success
	},
	error: function(dogLocation, error) {
	  	console.log("Parse failed with " + error);
	}
	});
	
	checkIfSunday(time);
}

function checkIfSunday(time)
{
	var date = new Date(time);
	
	if (date.getDay() == 0)
	{
		//means we're now at Sunday so delete everything from two weeks ago.
		var twoWeeksAgo = time - (14*24*60*60*1000);
		
		deleteLocations(twoWeeksAgo);
	}
}

function getRecordIds(time)
{
	var query = new Parse.Query("Dog_Location");
	var ids = new Array();
	query.select("Location").equalTo("Username", getCookie("username")).lessThanOrEqualTo("Time", time).find({
	  success: function(results) {
		for (var i = 0; i < results.length; i++)
		{
			ids.push(results[i].id);	
		}
	  },
	  error: function(error) {
		console.log("Cannot get info from Parse");
	  }
	});	
	
	return ids;
}

function deleteLocations(fromTime)
{
	var objectIds = getRecordIds(fromTime);
	
	/*
	curl -X POST \
	  -H "X-Parse-Application-Id: H4zb5P2LW0xRtP21SlKaWBFCuR2Cvwkd73OLlIyn" \
	  -H "X-Parse-Master-Key: XFvgotn8KdcFeNfB19JAU7uPDxBWsHsXrx9gOpbC" \
	  -H "Content-Type: application/json" \
	  -d '{"plan":"paid"}' \
	  https://api.parse.com/1/jobs/userMigration
	*/
	
	Parse.Cloud.run('removeTwoWeeksAgo', {objectIds: objectIds}, {
	  success: function(result) { },
	  error: function(error) { }
	});
	
	/*
	for (var i = 0; i < objectIds.length; i++)
	{
		var DogLocation = Parse.Object.extend("Dog_Location");
		var query = new Parse.Query(DogLocation);
		var doglocationobj;
		query.get(objectIds[i], {
		  success: function(object) {
			doglocationobj = object;
		  },
		  error: function(object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
		  }
		});	
		doglocationobj.destroy({
		  success: function(myObject) {
			// The object was deleted from the Parse Cloud.
		  },
		  error: function(myObject, error) {
			// The delete failed.
			// error is a Parse.Error with an error code and description.
		  }
		});
		
		doglocationobj.save();
	}
	*/
}

username = getCookie("username");
password = getCookie("password");
getUserFromFirebase(username, password, 'login');








