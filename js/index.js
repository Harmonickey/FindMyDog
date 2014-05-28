var myDataRef = new Firebase('https://findmydeardog.firebaseio.com/');

/* used to delete cookies */
var username1 = '';
var password1 = '';

$(function () {
	$( "#settings-toggle" ).click(function() {
	  $( "#settings-hide" ).animate({
	    height: "toggle"
	  }, 500, function() {
	    // Animation complete.
	  });
	});
	
	//console.log("on? " + getCookie("turned_on"));
   // if (convertBoolean(getCookie("turned_on"))) {
     	if (convertBoolean(myDataRef.child('user').child(username1).child('turned_on'))) {
	    $('#on-off').prop("checked", true);
	}

	if (convertBoolean(getCookie("follow_device"))) {
		$('#followDeviceBtn').hide();
		$('#unfollowDeviceBtn').show();
	}

	$('.on-off :checkbox').iphoneStyle();
	Parse.initialize('5PiDj5mmWu0MlMbqRrSBhqafp4nome88BqM0uvJs', 'ScrtuaWOtSQ2sCpnEPEh8BjpCJhUxSHAm6MLEoMc');
	
	//if there is a username and password, then there must be a phonenumber, radius, and baselocation
	//var username = getCookie("username");
	//var password = getCookie("password");
	var username = username1;
	var password = password1;

	/*if (getUserFromFirebase(username, password, 'mainscreen'))
	{
		initialize(username, password);
		var phoneNumber = getCookie("phoneNumber");
		var radius = getCookie("radius");
		var baseLocation = getCookie("baseLocation");
		
		if (phoneNumber && radius && baseLocation)
		{
			changeStatus("Login");
		}	
	} */

	if (getUserFromFirebase(username, password, 'mainscreen'))
	{
		initialize(username, password);
		/*var phoneNumber = myDataRef.child('user').child(username).child('Phone_Number');
		var radius = myDataRef.child('user').child(username).child('Threshold');
		var baseLocation = myDataRef.child('user').child(username).child('Base_Location');*/
		var phoneNumber = getPhoneNumber(username);
		var radius = getRadius(username);
		var baseLocation = getLocation(username);
		if (phoneNumber && radius && baseLocation)
		{
			changeStatus("Login");
		}	
	} 

});

function getLocation(username) 
{
          var baseLocation;
          var UserID = username;
          var firebaseAPI = "https://findmydeardog.firebaseio.com/user/" + UserID +"/.json";
          $.ajax ({
            dataType : "jsonp",
            url : firebaseAPI,
            async : false,
            success : function(data) {
              baseLocation = data["Base_Location"];
            }
          });
	  return baseLocation;
}

function getRadius(username) 
{
          var radius;
          var UserID = username;
          var firebaseAPI = "https://findmydeardog.firebaseio.com/user/" + UserID +"/.json";
          $.ajax ({
            dataType : "jsonp",
            url : firebaseAPI,
            async : false,
            success : function(data) {
              radius = data["Threshold"];
            }
          });
	  return radius;
}

function getPhoneNumber(username) 
{
          var phoneNumber;
          var UserID = username;
          var firebaseAPI = "https://findmydeardog.firebaseio.com/user/" + UserID +"/.json";
          $.ajax ({
            dataType : "jsonp",
            url : firebaseAPI,
            async : false,
            success : function(data) {
              phoneNumber = data["Phone_Number"];
            }
          });
	  return phoneNumber;
}
/*function getCookie(cname)
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

function setCookie(cname,cvalue,exdays)
{
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}
*/

function changeStatus(status)
{
	if (status == "Login")
	{
		updateFirebaseTurnOn(username1, password1, 'true');
		$("#loginout").html("Logout"); //enable the button
	}
	else if (status == "Logout")
	{
		updateFirebaseTurnOn(username1, password1, 'false');
		$("#loginout").html("Login");
		username1 = '';
		password1 = '';
		//this erases the cookies
		//document.cookie = "";
	}
}

/*function setAllCookies(username, password, radius, phoneNumber, baseLocation, baseLat, baseLong)
{
	setCookie('username', username, 30);
	setCookie('password', password, 30);
	setCookie('radius', radius, 30);
	setCookie('phoneNumber', phoneNumber, 30);
	setCookie('baseLocation', baseLocation, 30);
	setCookie('baseLat', baseLat, 30);
	setCookie('baseLong', baseLong, 30);
}*/

function checkLogInOrOut()
{
	//var username = getCookie("username");
	var username = username1;
	
	//if (!username)
	if (username == '')
	{
		//means it's showing "Login"
		showModal('#loginModal');	
	}
	else
	{
		//means it's showing "Logout"
		logout();
	}
}

/*function checkLogInOrOut2()
{
	var username = getCookie("username");
	
	if (!username)
	{
		//means it's showing "Login"
		showModal('#loginModal');	
	}
	else
	{
		//means it's showing "Logout"
		loadUser();
	}
}*/

function checkLogInOrOut2()
{
	//var username = getCookie("username");
	var username = username1;
	
	//if (!username)
	if (username == '')
	{
		//means it's showing "Login"
		showModal('#loginModal');	
	}
	else
	{
		//means it's showing "Logout"
		loadUser();
	}
}

function loadUser()
{
	//var username = getCookie("username");
	var username = username1;
	
	//if (!username)
	if (username == '')
	{
		showModal('#loginModal');	
	}
	else
	{
		changeStatus("Login");
		initializeTracker();
	}
}

function checkFirebaseForLogin(username, password, module)
{
	//check Firebase for login name	
	if(getUserFromFirebase(username, password, module))
	{
		//if good then change the Login to Logout and set variables, close loginModal
		if (module == 'login')
		{
			hideModal('#loginModal');
		}
		return true;
	}
	else
	{
		return false;
	}
}

function createFirebaseUser(username, password, phoneNumber, radius, baseLocation)
{
	var geoLocate = "https://maps.googleapis.com/maps/api/geocode/json?address=" + baseLocation + "&sensor=false&key=AIzaSyAjECgtOkJf0xeIpProlCseMUfh4VF6jGg";
	var result;
	$.ajax ({
		dataType: "json",
		url: geoLocate,
		async: false,
		success: function(data) {
			result = data
		}
	});

	var baseLat = result['results'][0]['geometry']['location']['lat'];
	var baseLong = result['results'][0]['geometry']['location']['lng'];

	 if (checkFirebaseForLogin(username, password, 'register'))
	 {
	 	myDataRef.child('user').child(username).set({
			'Password': password, 
			'Base_Location': baseLocation,
			'baseLat': baseLat,
			'baseLong': baseLong,
			'Phone_Number': phoneNumber,
			'Threshold': radius,
			'dogLat': null,
			'dogLng': null,
			'turned_on': 'true',
			});
			
		setAllCookies(username, password, radius, phoneNumber, baseLocation, baseLat, baseLong);
		return true;
	 }
	 
	 return false;
}

function updateFirebase(username, password, phoneNumber, radius, baseLocation, baseLat, baseLong)
{
	myDataRef.child('user').child(username).update(
		{
		 'Phone_Number': phoneNumber,
		 'Threshold': radius,
		 'Base_Location': baseLocation,
		 'baseLat': baseLat,
		 'baseLong': baseLong
		});
}

function updateFirebaseTurnOn(username, password, turned_on)
{
	myDataRef.child('user').child(username).update(
		{
		 'turned_on': turned_on,
		});
}

function updateSingleFirebaseAttribute(username, attrname, attr)
{
	var newAttr = {};
	newAttr[attrname] = attr;
	console.log(attrname);
	console.log(attr);
	console.log(newAttr);
	myDataRef.child('user').child(username).update(newAttr);
}

function fillInFrontpage(phoneNumber, radius, baseLocation)
{
	$("#new_radius").val(radius);
	$("#new_phonenumber").val(phoneNumber);
	$("#new_baselocation").val(baseLocation);
}

function getUserFromFirebase(username, password, module)
{
	if (username && password && module)
	{
		//check firebase for the user
		var firebaseAPI = "https://findmydeardog.firebaseio.com/user/" + username+ ".json";
		var result;
		$.ajax ({
			dataType: "json",
			url: firebaseAPI,
			async: false,
			success: function(data) {
				result = data
			}
		});
		
		if (result != 'null' && result != null)
		{
			if (module == 'login')
			{
				if (result['Password'] == password)
				{
					setUser(username, password, result['Phone_Number'], result['Threshold'], result['Base_Location'], result['baseLat'], result['baseLong']);
					return true;
				}
				else
				{
					setError('no_pass', module);
					return false;
				}
			}
			else if (module == 'register')
			{
				
				setUser(username, password, result['Phone_Number'], result['Threshold'], result['Base_Location'], result['baseLat'], result['baseLong']);
				return false;
			}
			else if (module == 'mainscreen')
			{
				setUser(username, password, result['Phone_Number'], result['Threshold'], result['Base_Location'], result['baseLat'], result['baseLong']);
				return true;	
			}
			
		}
		else
		{
			if (module == 'login')
			{
				setError('no_user', module);
				return false;
			}
			else if (module == 'register') 
			{
				return true;
			}
			else if (module == 'mainscreen')
			{
				return false;
			}
		}
	} 
	else 
	{
		setError('no_user', module);
		return false;	
	}
}

function setUser(username, password, phoneNumber, radius, baseLocation, baseLat, baseLong)
{
	fillInFrontpage(phoneNumber, radius, baseLocation);
	//updateFirebase(username, password, phoneNumber, radius, baseLocation, baseLat, baseLong);
	//setAllCookies(username, password, radius, phoneNumber, baseLocation, baseLat, baseLong);
}

function login()
{
	var username = $("#username").val();
	var password = $("#password").val();
	username1 = username;
	password1 = password;
	
	if (checkFirebaseForLogin(username, password, 'login'))
	{
		updateFirebaseTurnOn(username, password, 'true');
		changeStatus("Login");
		initialize(username, password);	
	}
}

function logout()
{
	var res = confirm("Are you sure you want to logout?");
	if (res) {
		changeStatus("Logout");	
		updateFirebaseTurnOn(username, password, 'false');
		username1 = '';
		password1 = '';
	}
}

function loginTracker() {
	var username = $("#username").val();
	var password = $("#password").val();
	
	if (checkFirebaseForLogin(username, password, 'login'))
	{
		changeStatus("Login");
		initializeTracker();	
	}
}

function register()
{
	var username = $("#reg_username").val();
	var password = $("#reg_password").val();
	var phoneNumber = $("#reg_phone").val();
	var radius = $("#reg_radius").val();
	var baseLocation = $("#reg_baseLocation").val();

	var isANumber = isNaN(radius) === false;
	if(!isANumber) {
		setError('no_radius', 'register');
		return;
	}
	
	if(createFirebaseUser(username, password, phoneNumber, radius, baseLocation))
	{
		hideModal("#registerModal");	
	}
	else
	{
		setError('no_user', 'register');	
	}
}

function showModal(modal)
{
	$(modal).modal('show');
}

function hideModal(modal)
{
	$(modal).modal('hide');	
}

function setError(error, module)
{
	switch (module) {
		case 'login':
			// $("#login_error").css('display', 'block');
			if (error == 'no_user')
				$("#login_error").html("Username not found");
			else if (error == 'no_pass')
				$("#login_error").html("Password not correct");		
		case 'register':
			$("#register_error").css('display', 'block');
			if (error == 'no_user')
				$("#register_error").html("Username already taken");
			if (error == 'no_radius')
				$("#register_error").html("Invalid radius");
		case 'mainscreen':
		case 'pn_modal':
			$("#phonenumber_error").css('display', 'block');
			$("#phonenumber_error").html("Invalid Phone Number");
		case 'rad_modal':
			$("#radius_error").css('display', 'block');
			$("#radius_error").html("Invalid Radius");
			$("#personal_radius_error").css('display', 'block');
			$("#personal_radius_error").html("Invalid Radius");
		case 'base_modal':
			$("#baselocation_error").css('display', 'block');
			$("#baselocation_error").html("Invalid Base Location");
	}
}

function updateRadius()
{
	var radius = $("#new_radius").val();
	var isANumber = isNaN(radius) === false;
	if (!isANumber) {
		setError(null, 'rad_modal');
		return;
	}

	//var username = getCookie("username");
	var username = username1;
	updateSingleFirebaseAttribute(username, "Threshold", parseInt(radius));
	//setCookie("radius", radius, 30);
	hideModal("#radiusModal");
}

function updateBaseLocation()
{
	var baseLocation = $("#new_baselocation").val();

	var geoLocate = "https://maps.googleapis.com/maps/api/geocode/json?address=" + baseLocation + "&sensor=false&key=AIzaSyAjECgtOkJf0xeIpProlCseMUfh4VF6jGg";
	var result;
	$.ajax ({
		dataType: "json",
		url: geoLocate,
		async: false,
		success: function(data) {
			result = data
		}
	});

	var baseLat = result['results'][0]['geometry']['location']['lat'];
	var baseLong = result['results'][0]['geometry']['location']['lng'];

    if (!baseLat || !baseLong)
	{
		setError(null, 'base_modal');
		return;	
	}

	var username = username1;
	var password = password1;
	//var username = getCookie("username");
	//var password = getCookie("password");
	updateSingleFirebaseAttribute(username, "Base_Location", baseLocation);
	updateSingleFirebaseAttribute(username, "baseLat", baseLat);
	updateSingleFirebaseAttribute(username, "baseLong", baseLong);
	setCookie("baseLocation", baseLocation, 30);
	setCookie('baseLat', baseLat, 30);
	setCookie('baseLong', baseLong, 30);
	hideModal("#baseLocationModal");	
	initialize(username, password);
}

function updatePhoneNumber()
{
	var phoneNumber = $("#new_phonenumber").val();
	
	//use Twilio verification here...
	//send request with phoneNumber
	Parse.Cloud.run('verifyPhoneNumber', {phoneNumber: phoneNumber}, {
	  success: function(result) {;
		  if (result.validationCode)
		  {
			  $("#validation_number").html(result.validationCode);
			  showModal("#validation");
		  }
	  }
	});
	
	//var username = getCookie("username");
	var username = username1;
	
	if (!isPhoneNumber(phoneNumber))
	{
		setError(null, 'pn_modal');
		return;
	}
	
	updateSingleFirebaseAttribute(username, "Phone_Number", phoneNumber);
	setCookie("phoneNumber", phoneNumber, 30);
	hideModal("#phoneNumberModal");	
}

function convertBoolean(str)
{
	return (str == 'true' ? true : false);
}

function isPhoneNumber(number)
{
	return (number.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/) !== null);	
}

