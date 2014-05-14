<?php
$host="localhost";
$port=3306;
$socket="";
$user="root";
$password="";
$dbname="locations";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

$con->query("INSERT INTO dog_locations (Username, Latitude, Longitude, Time)
             VALUES ('" . $_POST['username'] . "', '" . $_POST['lat'] . "', '" . $_POST['long'] . "', '" . $_POST['time'] . "');");

$con->close();
?>