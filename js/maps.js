var map; //will be used for map on page

var initialized = false;
var turned_on = false;
var username;
var password;

var static_loc;
var static_dog;
var threshold;

//#### markers and lines that will be needed as global variables####
var dog;
var pet_marker;
var line;


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
      initialized = true;

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
  initialized = true;
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
  if(initialized==true) {
    pullDogLocation();
    pet_marker.setPosition(static_dog); //update the dog's position on the map
    line.setPath([static_loc, static_dog]); //update the line on the map
    getDistance(static_loc, static_dog); //get the distance between the home location and the dog
  //});
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
var alerted = false;

function getDistance(loc, pos) {
  //calculate distance in meters
  var d = google.maps.geometry.spherical.computeDistanceBetween(loc, pos);
  d = 3.28084*d; //convert to feet
  console.log("Distance: " + String(d));
  parseDistance(d);
}

function parseDistance(dist) {
  if(turned_on==true) {
    //if out of range
    if (dist>threshold) {
      //remove in-range counter
      in_counter = 0;
      //increment out of range counter
      out_counter++;
      //if has been out of range 3 times consecutively
      if (out_counter==3) {
        if(alerted==false) {
          sendAlert();
          alerted = true;
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
        alerted = false;
      }
    }
  }
}

function toggleON_OFF() {
  if(turned_on==true) {
    turned_on = false;
  }
  else {
    turned_on = true;
    out_counter = 0;
    in_counter = 0;
  }
}


//send alert to user
function sendAlert() {
  if(turned_on==true) {
    alert("Dog is running away!");
    
    $.ajax({
		type: 'POST',
     	dataType: 'jsonp',
  	 	url: 'text.php',
  	 	data: {
  			'To': getCookie("phoneNumber"),
  			'From':'+12692042709',
 	 		'Body':'Dog is running away!'	 
  		 }
    });
  }
}

//create the map upon loading the page
//google.maps.event.addDomListener(window, 'load', initialize);

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
      console.log(lat1);
      console.log(long1);
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

function storeDogLocation(lat, long)
{
	var t = new Date();
	var time = t.getMilliseconds();
	$.ajax({
		type: 'POST',
		dataType: 'jsonp',
		url: 'inject_data.php',
		data: {
			'username': getCookie('username'),
			'lat': lat,
			'long': long,
			'time': time
		},
		success: function(ret) {
			console.log(ret);	
		},
		complete: function(ret) {
			console.log(ret);	
		}
	});	
}


