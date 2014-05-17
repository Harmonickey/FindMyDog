var map; //will be used for map on page

var initialized = convertBoolean(getCookie("turned_on"));
var turned_on = convertBoolean(getCookie("turned_on"));
var username;
var password;

var static_loc;
var static_dog;
var threshold;

//#### markers and lines that will be needed as global variables####
var dog;
var pet_marker;
var line;
var owner_marker;
var owner_circle;
var owner_location;


function initialize(user, pass) {
  username = user;
  password = pass;
  getUserFromFirebase(username, password, 'login');

  var firebaseAPI = "https://findmydeardog.firebaseio.com/user/" + username+ ".json";
  var result;
  $.ajax ({
    dataType: "json",
    url: firebaseAPI,
    async: false,
    success: function(data) {
      result = data;
      static_loc = new google.maps.LatLng(result['baseLat'], result['baseLong']);
      threshold = result['Threshold'];

      //options for the displayed map
      var mapOptions = {
        zoom: 18,
        center: static_loc
      }
      //create the map
      map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
      setCookie("initialized", 'true');

      //set a marker for the home location
      var static_marker = new google.maps.Marker({
        position: static_loc,
        map: map,
        title: "Home",
        icon: 'images/home.png'
      });
      //create a circle around the home location
      var large = parseFloat(threshold)/3.28084;
      var static_circle1 = new google.maps.Circle({
        map: map,
        radius: large,
        fillColor: '#333333',
        fillOpacity: 0.2,
        strokeWeight: 0,
        strokeOpacity: 0.5
      });
      static_circle1.bindTo('center', static_marker, 'position');
      //create a circle around the home location
      var mid = parseFloat(threshold)/3.28084 - (parseFloat(threshold)/(3*3.28084));
      var static_circle2 = new google.maps.Circle({
        map: map,
        radius: mid,
        fillColor: '#333333',
        fillOpacity: 0.2,
        strokeWeight: 0,
        strokeOpacity: 0.5
      });
      static_circle2.bindTo('center', static_marker, 'position');
      //create a circle around the home location
      var small = parseFloat(threshold)/3.28084 - 2*(parseFloat(threshold)/(3*3.28084));
      var static_circle3 = new google.maps.Circle({
        map: map,
        radius: small,
        fillColor: '#333333',
        fillOpacity: 0.2,
        strokeWeight: 0,
        strokeOpacity: 0.5
      });
      static_circle3.bindTo('center', static_marker, 'position');

      owner_circle = new google.maps.Circle({
        map: map,
        radius: 200,
        fillColor: '#333333',
        fillOpacity: 0.3,
        strokeWeight: 0,
        strokeOpacity: 0.5,
      });

      owner_marker = new google.maps.Marker({
        map: map,
        title: "Owner's Location",
        icon: "images/male.png"
      });
    }
  });
  if(result['dogLat']!=null) {
    addDog(result['dogLat'], result['dogLng']);
  }
}

function addDog(lat, lng) {
  static_dog = new google.maps.LatLng(lat, lng);
  //set a marker for the dog
  pet_marker = new google.maps.Marker({
    position: static_dog,
    map: map,
    title: "Dog",
    icon: 'images/pets2.png',
    animation: google.maps.Animation.DROP,
  })
  //draw a line between the home location and the dog
  line = new google.maps.Polyline({
    path: [static_loc, static_dog],
    geodesic: true,
    strokeColor: '#008f8F',
    strokeOpacity: 0.5,
    strokeWeight: 3
  });
  //put the line on the map
  line.setMap(map);
  setCookie("initialized", 'true');
}



setInterval(trackLocation, 3000); //regularly update the position of the dog on the map

/*
#### Code for simulated dog, so position moves during test ####
*/
//setInterval(alterLocation, 2000); //regularly change the location of the simulated dog
function alterLocation() {
  var num = Math.round(Math.random()); //randomly choose 0 or 1
  switch(num) {
    case 0:
      pet_lat+= .000012; //change the latitude
      break;
    case 1:
      pet_long+= .00005;
      break;
  }
  static_dog = new google.maps.LatLng(pet_lat, pet_long); //update the dog's position
}

function trackLocation() {
  if(convertBoolean(getCookie("initialized"))) {
    if(convertBoolean(getCookie("follow_device"))) {
      getUserLocation();
      console.log(owner_location);
      pullDogLocation();
      pet_marker.setPosition(static_dog); //update the dog's position on the map
      line.setPath([owner_location, static_dog]);
      var personal_radius = parseInt(getCookie("personal_radius"));
      getDistance(owner_location, static_dog, personal_radius);
    }
    else {
      pullDogLocation();
      pet_marker.setPosition(static_dog); //update the dog's position on the map
      line.setPath([static_loc, static_dog]); //update the line on the map
      getDistance(static_loc, static_dog, threshold); //get the distance between the home location and the dog
    }
  }
}

/*
#### check the distance of the dog ####
--> counters are used for making alerts
----> if dog is out of range 3x in a row, set an alert
----> does not send another alert unless it has been in range 3x in a row
*/
var out_counter = 0;
var in_counter = 0;
var alerted = convertBoolean(getCookie("alerted"));

function getDistance(loc, pos, thres) {
  //calculate distance in meters
  var d = google.maps.geometry.spherical.computeDistanceBetween(loc, pos);
  d = 3.28084*d; //convert to feet
  //console.log("Distance: " + String(d));
  parseDistance(d, thres);
}

function parseDistance(dist, thres) {
  if(convertBoolean(getCookie("turned_on"))) {
    //if out of range
    if (dist>thres) {
      //remove in-range counter
      in_counter = 0;
      //increment out of range counter
      out_counter++;
      //if has been out of range 3 times consecutively
      if (out_counter==3) {
        if(!convertBoolean(getCookie("alerted"))) {
          sendAlert();
          setCookie("alerted", "true");
        }
      }
    }
    //if in range
    else {
      //remove out of range counter
      out_counter = 0;
      //increment in range counter
      in_counter++;
      if (in_counter==3) {
        setCookie("alerted", "false");
      }
    }
  }
}

function toggleON_OFF() {	
  if(convertBoolean(getCookie("turned_on"))) {
    setCookie("turned_on", 'false', 30);
  }
  else {
    setCookie("turned_on", 'true', 30);
    $('#on-off').prop("checked", true);
    out_counter = 0;
    in_counter = 0;
  }
}

//send alert to user
function sendAlert() {
  if(convertBoolean(getCookie("turned_on"))) {
    //alert("Dog is running away!");
    
	Parse.Cloud.run('sendText', {phoneNumber: getCookie("phoneNumber")}, {
	  success: function(result) { },
	  error: function(error) { }
	});
  }
}

window.onload = function() {
    setTimeout(function() { window.scrollTo(0, 1) }, 100);
};

function pullDogLocation() {
  var userInfo = "https://findmydeardog.firebaseio.com/user/" + username + ".json";
  var result;
  $.ajax ({
    dataType: "json",
    url: userInfo,
    async: false,
    success: function(data) {
      result = data;
    }
  });

  if (result!='null' && result!=null) {
    if(result['Password']==password) {
      var long1 = result['dogLng'];
      var lat1 = result['dogLat'];
      static_dog = new google.maps.LatLng(lat1, long1);
      //console.log(lat1);
      //console.log(long1);
	  storeDogLocation(lat1, long1);
      if (result['Threshold']!=threshold) {
        initialize(username, password);
      }
    }
  }
  else {
    console.log("fail");
  }
}

function getUserLocation() {
  var result;
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      owner_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(owner_location);
      owner_marker.setPosition(owner_location);
      var r = parseFloat(getCookie("personal_radius"));
      r = r/3.28084;
      owner_circle.set('radius', r);
      owner_circle.bindTo('center', owner_marker, 'position');
    });
  }
}

function storeDogLocation(lat, long)
{
	var t = new Date();
	var time = t.getTime();
	
	var DogLocation = Parse.Object.extend("Dog_Location");
	var dogLocation = new DogLocation();
	var location = new Parse.GeoPoint(lat, long);
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

function FollowDevice() {
  var new_radius = $("#new_person_radius").val();
  var isANumber = isNaN(new_radius) === false;
  if (!isANumber) {
    setError(null, 'rad_modal');
    return
  }

  $("#followDeviceBtn").hide();
  $("#unfollowDeviceBtn").show();
  setCookie("follow_device", true, 1);
  setCookie("personal_radius", new_radius, 30);
  hideModal("#followDeviceModal");
  console.log("following: true");
  owner_marker.setVisible(true);
  owner_circle.setVisible(true);
}

function UnfollowDevice() {
  map.setCenter(static_loc);
  $("#followDeviceBtn").show();
  $("#unfollowDeviceBtn").hide();
  setCookie("personal_radius", "", 0);
  setCookie("follow_device", false, 1);
  console.log("following: false");
  owner_marker.setVisible(false);
  owner_circle.setVisible(false);
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





