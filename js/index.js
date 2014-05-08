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
	var password = getCookie("password");
	getUserFromFirebase(username, password, 'mainscreen');
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

function checkFirebaseForLogin(username, password, module)
{
	//check Firebase for login name	
	if(getUserFromFirebase(username, password, module))
	{
		//if good then change the Login to Logout and set variables, close loginModal
		if (module == 'login')
		{
			fillInFrontPage(phoneNumber, radius, baseLocation);
			hideLoginModal();
		}
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
	 if (checkFirebaseForLogin(username, password, 'register'))
	 {
	 	myDataRef.child('user').child(username).set({'password': password});
		return true;
	 }
	 
	 return false;
}

function fillInFrontpage(phoneNumber, radius, baseLocation)
{
	
}

function getUserFromFirebase(username, password, module)
{
	if (username && password && module)
	{
		//check firebase for the user
		var firebaseAPI = "https://findmydeardog.firebaseio.com/user/" + username+ "/.json";
		var ret_val = false;
		$.ajax ({
			dataType : "jsonp",
			url : firebaseAPI,
			async : false,
			success : function(data) {
				console.log("Data: " + data);
		  		if (data != 'null' && data != null)
				{
					console.log("Module: " + module);
					if (module == 'login')
					{
						if (data['Password'] == password)
						{
							setUser(username, data['Location'], data['Phone_Number'], data['Threshold']);
							ret_val = true;
						}
						else
						{
							setError('no_pass', module);
							ret_val = false;
						}
					}
					else if (module == 'register')
					{
						ret_val = false;
					}
				}
				else
				{
					console.log("Module: " + module);
					if (module == 'login')
					{
						setError('no_user', module);
						ret_val = false;
					}
					else if (module == 'register') 
					{
						ret_val = true;
						console.log("Set Val: " + ret_val);
					}
				}
			}
		});
		console.log(ret_val);
		return ret_val;
		//if there is a user then fill in the appropriate information on the frontpage elements and store variables
		//fillInFrontpage(phoneNumber, radius, baseLocation);
	} 
	else 
	{
		setError('no_user', module);
		return false;
		//if no user, then fill in defaults	
	}
}

function setUser(username, phoneNumber, radius)
{
	
}

function login()
{
	var username = $("#username").val();
	var password = $("#password").val();
	
	if (checkFirebaseForLogin(username, password, 'login'))
	{
		setCookie("username", username, 30);
		setCookie("password", password, 30);
	}
}

function register()
{
	var username = $("#new_username").val();
	var password = $("#new_password").val();
	
	if(createFirebaseUser(username, password))
	{
		hideRegisterModal();	
	}
	else
	{
		setError('no_user', 'register');	
	}
	
	
}

function showRegisterModal()
{
	hideLoginModal();
	$('#registerModal').modal('show');
}

function hideRegisterModal()
{
	$('#registerModal').modal('hide');
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