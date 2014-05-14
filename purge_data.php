<?php
$host="localhost";
$port=3306;
$socket="";
$user="root";
$password="";
$dbname="locations";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

//dangerous query, be careful
$con->query("DELETE FROM dog_locations WHERE
			 Time <= " . $_POST['time']);

$con->close();
?>