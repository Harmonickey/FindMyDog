var myDataRef = new Firebase('https://findmydeardog.firebaseio.com/');

$(function () {
	$( "#settings-toggle" ).click(function() {
	  $( "#settings-hide" ).animate({
	    height: "toggle"
	  }, 500, function() {
	    // Animation complete.
	  });
	});
	
	//if there is a username and password, then there must be a phonenumber, radius, and baselocation
	var username = getCookie("username");
	var password = getCookie("password");
	if (getUserFromFirebase(username, password, 'mainscreen'))
	{
	
		var phoneNumber = getCookie("phoneNumber");
		var radius = getCookie("radius");
		var baseLocation = getCookie("baseLocation");
		
		if (phoneNumber && radius && baseLocation)
		{
			changeStatus("Login");
		}	
	}
});

function getCookie(cname)
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
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function changeStatus(status)
{
	
	if (status == "Login")
	{
		$("#loginBtn").html("Logout");
	}
	else if (status == "Logout")
	{
		$("#loginBtn").html("Login");
		//this erases the cookies
		setCookie("username", "", 0);
		setCookie("password", "", 0);
		setCookie("radius", "", 0);
		setCookie("phoneNumber", "", 0);
		setCookie("baseLocation", "", 0);
	}
}

function setAllCookies(username, password, radius, phoneNumber, baseLocation)
{
	setCookie('username', username, 30);
	setCookie('password', password, 30);
	setCookie('radius', radius, 30);
	setCookie('phoneNumber', phoneNumber, 30);
	setCookie('baseLocation', baseLocation, 30);
}

function checkLogInOrOut()
{
	if ($("#loginBtn").html() == "Logout")
	{
		var res = confirm("Are you sure you want to logout?");
		if (res) changeStatus("Logout");
	}
	else
	{
		showModal('#loginModal');
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
	 if (checkFirebaseForLogin(username, password, 'register'))
	 {
	 	myDataRef.child('user').child(username).set({
			'Password': password, 
			'Base_Location': baseLocation,
			'Phone_Number': phoneNumber,
			'Threshold': radius
			});
			
		setAllCookies(username, password, radius, phoneNumber, baseLocation);
		return true;
	 }
	 
	 return false;
}

function updateFirebase(username, password, phoneNumber, radius, baseLocation)
{
	myDataRef.child('user').child(username).update(
		{
		 'Phone_Number': phoneNumber,
		 'Threshold': radius,
		 'Base_Location': baseLocation
		});
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
					setUser(username, password, result['Phone_Number'], result['Threshold'], result['Base_Location']);
					return true;
				}
				else
				{
					setError('no_pass', module);
					return false;
				}
			}
			else if (module == 'register' || module == 'mainscreen')
			{
				
				setUser(username, password, result['Phone_Number'], result['Threshold'], result['Base_Location']);
				return false;
			}
		}
		else
		{
			if (module == 'login')
			{
				setError('no_user', module);
				return false;
			}
			else if (module == 'register' || module == 'mainscreen') 
			{
				
				$("#loginBtn").html("Logout");
				setCookie("loggedIn", false);
				return true;
			}
		}
	} 
	else 
	{
		setError('no_user', module);
		return false;	
	}
}

function setUser(username, password, phoneNumber, radius, baseLocation)
{
	fillInFrontpage(phoneNumber, radius, baseLocation);
	updateFirebase(username, password, phoneNumber, radius, baseLocation);
	setAllCookies(username, password, radius, phoneNumber, baseLocation);
}

function login()
{
	var username = $("#username").val();
	var password = $("#password").val();
	
	checkFirebaseForLogin(username, password, 'login');	
}

function register()
{
	var username = $("#reg_username").val();
	var password = $("#reg_password").val();
	var phoneNumber = $("#reg_phone").val();
	var radius = $("#reg_radius").val();
	var baseLocation = $("#reg_baseLocation").val();
	
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

function updateRadius()
{
	var radius = $("#new_radius").val();
	var username = getCookie("username");
	updateSingleFirebaseAttribute(username, "Threshold", radius);
	setCookie("radius", radius, 30);
	hideModal("#radiusModal");
}

function updateBaseLocation()
{
	var baseLocation = $("#new_baselocation").val();
	var username = getCookie("username");
	updateSingleFirebaseAttribute(username, "Base_Location", baseLocation);
	setCookie("baseLocation", baseLocation, 30);
	hideModal("#baseLocationModal");	
}

function updatePhoneNumber()
{
	var phoneNumber = $("#new_phonenumber").val();
	var username = getCookie("username");
	updateSingleFirebaseAttribute(username, "Phone_Number", phoneNumber);
	setCookie("phoneNumber", phoneNumber, 30);
	hideModal("#phoneNumberModal");	
}