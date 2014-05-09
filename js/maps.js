var map; //will be used for map on page

//#### static location at Ford ####
var slat = 42.056918;
var slong = -87.676703;
var static_loc = new google.maps.LatLng(slat, slong);

//#### dog location, starting in Ford ####
var pet_lat = 42.056800;
var pet_long = -87.676600;
var static_dog = new google.maps.LatLng(pet_lat, pet_long);

//#### markers and lines that will be needed as global variables####
var dog;
var pet_marker;
var line;


function initialize() {
  //options for the displayed map
  var mapOptions = {
  	zoom: 18,
  	center: static_loc
  }
  //create the map
  map = new google.maps.Map(document.getElementById('map-canvas'),
  	mapOptions);

  //get original geolocation
/*  if(navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  		dog = new google.maps.Marker( {
  			position: pos,
  			map: map,
  			title: "My Location",
  		});
  	});
  }
*/

  //set a marker for the dog
  pet_marker = new google.maps.Marker({
    position: static_dog,
    map: map,
    title: "Dog",
    icon: 'images/pets2.png',
    animation: google.maps.Animation.DROP,
  })
  //set a marker for the home location
  var static_marker = new google.maps.Marker({
  	position: static_loc,
  	map: map,
  	title: "Home",
    icon: 'images/home.png'
  });
  //create a circle around the home location at 150ft radius
  var static_circle1 = new google.maps.Circle({
  	map: map,
  	radius: 45,
  	fillColor: '#333333',
    fillOpacity: 0.2,
  	strokeWeight: 0,
    strokeOpacity: 0.5
  });
  static_circle1.bindTo('center', static_marker, 'position');
  //create a circle around the home location at 100ft radius
  var static_circle2 = new google.maps.Circle({
    map: map,
    radius: 30,
    fillColor: '#333333',
    fillOpacity: 0.2,
    strokeWeight: 0,
    strokeOpacity: 0.5
  });
  static_circle2.bindTo('center', static_marker, 'position');
  //create a circle around the home location at 50ft radius
  var static_circle3 = new google.maps.Circle({
    map: map,
    radius: 15,
    fillColor: '#333333',
    fillOpacity: 0.2,
    strokeWeight: 0,
    strokeOpacity: 0.5
  });
  static_circle3.bindTo('center', static_marker, 'position');
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

}

setInterval(trackLocation, 3000); //regularly update the position of the dog on the map

/*
#### Code for simulated dog, so position moves during test ####
*/
setInterval(alterLocation, 2000); //regularly change the location of the simulated dog
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
  //update the geolocated position
  /*
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    getDistance(static_loc, pos);
  */
  pet_marker.setPosition(static_dog); //update the dog's position on the map
  line.setPath([static_loc, static_dog]); //update the line on the map
  getDistance(static_loc, static_dog); //get the distance between the home location and the dog
  //});
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
  parseDistance(d);
}

function parseDistance(dist) {
  //if out of range
  if (dist>150) {
    console.log("Counter: " + String(out_counter));
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

//send alert to user
function sendAlert() {
  alert("Dog is running away!");
  /*
  #####################################
  ## Insert Twilio texting code here ##
  #####################################
  */
}

//create the map upon loading teh page
google.maps.event.addDomListener(window, 'load', initialize);




