var myDataRef = new Firebase('https://findmydeardog.firebaseio.com/');

$(function () {
	$( "#settings-toggle" ).click(function() {
	  $( "#settings-hide" ).animate({
	    height: "toggle"
	  }, 500, function() {
	    // Animation complete.
	  });
	});
	
	//first grab the user cookie if there is one
	var username = getCookie("username");
	console.log(username);
	getUser(username);
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

function showLoginModal()
{
	$('#loginModal').modal('show');
}

function hideLoginModal()
{
	//called on success of login
	$('#loginModal').modal('hide');	
}

function checkFirebaseForLogin(username)
{
	//check Firebase for login name	
	if(getUser(username))
	{
		//if good then change the Login to Logout and set variables, close loginModal
		fillInFrontPage(phoneNumber, radius, baseLocation);
		hideLoginModal();
		return true;
	}
	else
	{
		//if bad then send error message and do nothing else
		return false;
	}
}

function createFirebaseUser(username, password)
{
	 myDataRef.child('user').set(username);
	 myDataRef.child('user').child(username).child("Password").set(password);
}

function fillInFrontpage(phoneNumber, radius, baseLocation)
{
	
}

function getUser(username)
{
	if (username)
	{
		//check firebase for the user
		var val = myDataRef.child('user').child(username);
		console.log(val);
		return true;
		//setUser(username);
		//if there is a user then fill in the appropriate information on the frontpage elements and store variables
		//fillInFrontpage(phoneNumber, radius, baseLocation);
	} 
	else 
	{
		return false;
		//if no user, then fill in defaults	
	}
}

function login()
{
	var username = $("#username").val();
	var password = $("#password").val();
	
	if (checkFirebaseForLogin(username))
	{
		setCookie("username", username, 30); 	
		getUser(username);
	}
}

function register()
{
	var username = $("#new_username").val();
	var password = $("#new_password").val();
	
	createFirebaseUser(username, password);
}

function showRegisterModal()
{
	hideLoginModal();
	$('#registerModal').modal('show');
}