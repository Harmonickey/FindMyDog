// JavaScript Document

$(function () {
	
	Parse.initialize('5PiDj5mmWu0MlMbqRrSBhqafp4nome88BqM0uvJs', 'ScrtuaWOtSQ2sCpnEPEh8BjpCJhUxSHAm6MLEoMc');
	
});

function getReportInfo(minTime, maxTime)
{
	var query = new Parse.Query("Dog_Location");
	var lat_long = new Array();
	if (getCookie('username')!=null) {
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
	}
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
