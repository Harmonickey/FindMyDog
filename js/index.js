$(function () {
	$( "#settings-toggle" ).click(function() {
	  $( "#settings-hide" ).animate({
	    height: "toggle"
	  }, 500, function() {
	    // Animation complete.
	  });
	});
});