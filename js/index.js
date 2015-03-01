var myDataRef = new Firebase('https://findmydeardog.firebaseio.com/');
var error_modules = ['#register_error', '#login_error', '#phonenumber_error', '#radius_error', '#personal_radius_error', '#baselocation_error'];

$(function () {
	$( "#settings-toggle" ).click(function() {
	  $( "#settings-hide" ).animate({ height: "toggle" }, 500);
	});
	
	if (convertBoolean(getCookie("turned_on"))) {
		$('#on-off').prop("checked", true);
	}

	if (convertBoolean(getCookie("follow_device"))) {
		$('#followDeviceBtn').hide();
		$('#unfollowDeviceBtn').show();
	}

	$('.on-off :checkbox').iphoneStyle();
	
	Parse.initialize('5PiDj5mmWu0MlMbqRrSBhqafp4nome88BqM0uvJs', 'ScrtuaWOtSQ2sCpnEPEh8BjpCJhUxSHAm6MLEoMc');
	
	//if there is a username and password, then there must be a phonenumber, radius, and baselocation
	var username = $.cookie('username');
	var password = $.cookie('password');

	if (getUserFromFirebase(username, password, 'mainscreen'))
	{
		$("#user_id").text(username);
		initialize();
		var phoneNumber = $.cookie("phoneNumber");
		var radius = $.cookie("radius");
		var baseLocation = $.cookie("baseLocation");
		
		if (phoneNumber && radius && baseLocation)
		{
			changeStatus("Login");
		}	
	} 
	
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox((input));
	
	google.maps.event.addListener(searchBox, 'place_changed', function() {
		var place = searchBox.getPlace();
		if (!place.geometry) {
			return;
		}
	});
});

function setOnOff() {
	if (getUserFromFirebase(username, password, 'mainscreen'))
	{
		if ($.cookie("turned_on", Boolean)) {
	    	$('#on-off').prop("checked", true);
		}
	} 
}

function changeStatus(status)
{
	if (status == "Logout")
	{
		clearAllCookies(); 
		$("#user_id").text("");
	}
}

function clearAllCookies()
{
	$.removeCookie('username');
	$.removeCookie('password');
	$.removeCookie('radius');
	$.removeCookie('phoneNumber');
	$.removeCookie('baseLocation');
	$.removeCookie('baseLat');
	$.removeCookie('baseLong');
	$.removeCookie('dog_added');
	$.removeCookie('initialized');
	$.removeCookie('turned_on');
}

function setAllCookies(username, password, radius, phoneNumber, baseLocation, baseLat, baseLong, turned_on)
{
	$.cookie('username', username, { expires: 30 });
	$.cookie('password', password, { expires: 30 });
	$.cookie('radius', radius, { expires: 30 });
	$.cookie('phoneNumber', phoneNumber, { expires: 30 });
	$.cookie('baseLocation', baseLocation, { expires: 30 });
	$.cookie('baseLat', baseLat, { expires: 30 });
	$.cookie('baseLong', baseLong, { expires: 30 });
	$.cookie('turned_on', turned_on, { expires: 30 });
}

function checkLogInOrOut()
{
	var username = $.cookie("username");
	
	if (!username)
	{
		//means the webpage was showing "Login"
		showModal('#loginModal');	
	}
	else
	{
		//means the webpage was showing "Logout"
		logout();
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
	}
	else
	{
		return false;
	}
	
	return true;
}

function createFirebaseUser(username, password, phoneNumber, radius, baseLocation, turned_on)
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
			'Turned_On': false
			});
			
		setAllCookies(username, password, radius, phoneNumber, baseLocation, baseLat, baseLong, turned_on);
		return true;
	 }
	 
	 return false;
}

function updateSingleFirebaseAttribute(username, attrname, attr)
{
	var newAttr = {};
	newAttr[attrname] = attr;
	myDataRef.child('user').child(username).update(newAttr);
}

function fillInFrontpage(phoneNumber, radius, baseLocation)
{
	$("#new_radius").val(radius);
	$("#new_phonenumber").val(phoneNumber);
	$("#pac-input").val(baseLocation);
}

function getUserFromFirebase(username, password, module)
{
	if (username && password)
	{
		//check firebase for the user
		var firebaseAPI = "https://findmydeardog.firebaseio.com/user/" + username + ".json";
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
					setUser(username, password, result['Phone_Number'], result['Threshold'], result['Base_Location'], result['baseLat'], result['baseLong'], result['Turned_On']);
				}
				else
				{
					setError(true, module, "Password incorrect");
					return false;
				}
			}
			else if (module == 'register')
			{
				
				setUser(username, password, result['Phone_Number'], result['Threshold'], result['Base_Location'], result['baseLat'], result['baseLong'], result['Turned_On']);
				return false;
			}
			else if (module == 'mainscreen')
			{
				setUser(username, password, result['Phone_Number'], result['Threshold'], result['Base_Location'], result['baseLat'], result['baseLong'], result['Turned_On']);	
			}
			
		}
		else
		{
			if (module == '#login_error')
			{
				setError(true, module, "Username not found");
			}
			else if (module == '#register_error') 
			{
				setError(true, module, "Username already taken");
			}
			else if (module == '#phonenumber_error')
			{
				setError(true, module, "Invalid phone number");
			}
			
			return false;			
		}
	} 
	else 
	{
		if (module == '#login_error')
		{
			setError(true, module, "Username not found");
		}
		else if (module == '#register_error') 
		{
			setError(true, module, "Username already taken");
		}
		else if (module == '#phonenumber_error')
		{
			setError(true, module, "Invalid phone number");
		}
		return false;	
	}
	
	return true;
}

function setUser(username, password, phoneNumber, radius, baseLocation, baseLat, baseLong, turned_on)
{
	fillInFrontpage(phoneNumber, radius, baseLocation);
	setAllCookies(username, password, radius, phoneNumber, baseLocation, baseLat, baseLong, turned_on);
}

function login()
{
	var username = $("#username").val();
	var password = $("#password").val();
	
	if (checkFirebaseForLogin(username, password, 'login'))
	{
		changeStatus("Login"); //doesn't really do anything though...
		$("#user_id").text(username);
		setError(false, '#login_error');
	}
}

function logout()
{
	var res = confirm("Are you sure you want to logout?");
	if (res) changeStatus("Logout");	
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
	var username = $("#reg_username").val().trim();
	$("#user_id").text(username);
	var password = $("#reg_password").val().trim();
	var phoneNumber = $("#reg_phone").val();
	var radius = $("#reg_radius").val().trim();
	var baseLocation = $("#pac-input").val();

	var isANumber = (isNaN(radius) === false);
	if(!isANumber || radius == "") {
		setError(true, '#register_error', 'Please enter a valid radius');
		return;
	}
	
	if (!isPhoneNumber(phoneNumber) || phoneNumber == "")
	{
		setError(true, '#register_error', 'Please enter a valid phone number');
		return;
	}
	
	if (username == "")
	{
		setError(true, '#register_error', 'Please enter a valid username');
		return;
	}
	
	if (password == "")
	{
		setError(true, '#register_error', 'Please enter a valid password');
		return;
	}
	
	if (baseLocation == "")
	{
		setError(true, '#register_error', 'Please enter a valid location');
		return;
	}
	
	if(createFirebaseUser(username, password, phoneNumber, radius, baseLocation))
	{
		hideModal("#registerModal");
		updatePhoneNumber(phoneNumber); 
	}
	else
	{
		setError(true, '#register_error', 'Username Not Found''register');
		return;
	}
	
	setError(false, '#register_error');
}

function showModal(modal)
{
	clearErrors();
	$(modal).modal('show');
}

function hideModal(modal)
{
	$(modal).modal('hide');
}

function clearErrors()
{
	for (var i = 0; i < error_modules.length; i++)
	{
		setError(false, error_modules[i]);
	}
}

function setError(isError, module, message)
{
	if (isError)
	{
		$(module).removeClass("hidden");
		$(module).html(message);
	}
	else
	{
		$(module).addClass("hidden");
		$(module).html("");
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
	setError(false, '#radius_error');
	var username = $.cookie("username");
	updateSingleFirebaseAttribute(username, "Threshold", parseInt(radius));
	$.cookie("radius", radius, { expires: 30 });
	hideModal("#radiusModal");
	initialize();
}

function updateBaseLocation()
{
	var baseLocation = $("#pac-input").val();

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
	$("#baselocation_error").css('display', 'none');
	var username = $.cookie("username");
	var password = $.cookie("password");
	
	updateSingleFirebaseAttribute(username, "Base_Location", baseLocation);
	updateSingleFirebaseAttribute(username, "baseLat", baseLat);
	updateSingleFirebaseAttribute(username, "baseLong", baseLong);
	
	$.cookie("baseLocation", baseLocation, {expires: 30} );
	$.cookie('baseLat', baseLat, {expires: 30});
	$.cookie('baseLong', baseLong, {expires: 30});
	
	hideModal("#baseLocationModal");	
	initialize();
}

function updatePhoneNumber(num)
{
	var phoneNumber = (num !== null ? num : $("#new_phonenumber").val());
	
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
	
	if (!isPhoneNumber(phoneNumber))
	{
		setError(true, '#phonenumber_error', "Please enter valid phone number");
		return;
	}
	
	setError(false, "#phonenumber_error");
	updateSingleFirebaseAttribute($.cookie("username"), "Phone_Number", phoneNumber);
	$.cookie("phoneNumber", phoneNumber, {expires: 30});
	
	if (num === null) hideModal("#phoneNumberModal");	
}

function convertBoolean(str)
{
	return (str == 'true' ? true : false);
}

function isPhoneNumber(number)
{
	return (number.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/) !== null);	
}

