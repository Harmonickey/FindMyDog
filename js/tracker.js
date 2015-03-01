var myDataRef = new Firebase('https://findmydeardog.firebaseio.com/');
Parse.initialize('5PiDj5mmWu0MlMbqRrSBhqafp4nome88BqM0uvJs', 'ScrtuaWOtSQ2sCpnEPEh8BjpCJhUxSHAm6MLEoMc');

var map; //will be used for map on page

var dog_marker; //used to mark the location of the dog_marker
var positions = [];
var max = 5;
var line1, line2, line3, line4;

function initializeTracker() {
  //get original geolocation
  if($.cookie("username")) {
	  if(navigator.geolocation) {
	  	navigator.geolocation.getCurrentPosition(function(position) {
	  		lat = position.coords.latitude;
	  		lng = position.coords.longitude;
	  		updateFirebaseLocation(lat, lng);
	  		$("#user_id").text(username);
	  	});
	  }
  }
  else {
  	window.location.href = "index.html";
  }
}

setInterval(trackLocation, 1000);

function trackLocation() {
	if($.cookie("username")) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			if(position.coords.latitude && position.coords.longitude) {	
  				updateFirebaseLocation(position.coords.latitude, position.coords.longitude);
  				$("#status").text("Transmitting location...");
  				document.getElementById('status').style.color = 'green';
				storeDogLocation(position.coords.latitude, position.coords.longitude);
  			}
  			else {
  				$("#status").text("Error: Location not found");
  				document.getElementById('status').style.color = 'red';
  			}
		});
	}
	else {
		window.location.hrefs = "index.html";
	}
}

function updateFirebaseLocation(lat, lng) {
	console.log(lat + ',' + lng);
	myDataRef.child('user').child($.cookie("username")).update({
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
		Username: $.cookie("username"),
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
	
	//checkIfSunday(time);
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
	
	Parse.Cloud.run('removeTwoWeeksAgo', {objectIds: objectIds}, {
	  success: function(result) { },
	  error: function(error) { }
	});
	
}

username = $.cookie("username");
password = $.cookie("password");
getUserFromFirebase(username, password, 'login');








