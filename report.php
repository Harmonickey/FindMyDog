<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- <meta name="apple-mobile-web-app-capable" content="yes"> -->
    <title>Find My Dog</title>
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="css/report.css">
  </head>

	<body>
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Find My Dog</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Map</a></li>
            <li><a href="#">Report</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>
      </div>
    </div>

		<div class="container-fluid" id="stats">
      <div class="row">
        <div class="col-sm-9 col-sm-offset-1 col-md-10 col-md-offset-1 main">
          <h1 class="page-header">Report</h1>

          <div class="row stats">
            <div class="col-xs-6 col-sm-3 quick-stat">
            	<div class="stat-circle blue">
            		<h2 class="circle-text"> 10.3 </h2>
            	</div>
            	<h4>Distance</h4>
              <span class="text-muted">Miles</span>
            </div>
            <div class="col-xs-6 col-sm-3 quick-stat">
              <div class="stat-circle cyan">
              	<h2 class="circle-text"> 14.6 </h2>
              </div>
              <h4>Speed</h4>
              <span class="text-muted">Miles/Hour</span>
            </div>
            <!-- Obviously, change the labels. Did we decide anything? -->
            <div class="col-xs-6 col-sm-3 quick-stat">
              <div class="stat-circle teal"> 
              	<h2 class="circle-text"> 199 </h2>
              </div>
              <h4>Total Distance</h4>
              <span class="text-muted">Miles</span>
            </div>
            <div class="col-xs-6 col-sm-3 quick-stat">
              <div class="stat-circle green"> 
              	<h2 class="circle-text"> 8.9 </h2> 
              </div>
              <h4>Average Distance</h4>
              <span class="text-muted">Miles/Day</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
      	<div class="col-sm-9 col-sm-offset-1 col-md-10 col-md-offset-1 main">
      		<div class="map">
      			<!-- any map stuff -->
      			This is where the map goes!
      		</div>
      	</div>
      </div>
      <div class="row">
      	<div class="selector">
	        <ul class="nav nav-pills">
			    	<li class="disabled"><a>Today</a></li> <!-- href removed just for now -->
			    	<li><a href="#">Yesterday</a></li>
			    	<li><a href="#">Choose Date</a></li>
			    </ul>
			  </div>
		  </div>
    </div>






	</body>
</html>