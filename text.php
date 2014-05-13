<?php
// Get the PHP helper library from twilio.com/docs/php/install
require_once('twilio-php/Services/Twilio.php'); // Loads the library
 
// Your Account Sid and Auth Token from twilio.com/user/account
$sid = "AC461d3f5fa9b34098d83e19417d88608c"; 
$token = "93e934c729223531780d8a0851d14ab3"; 
$client = new Services_Twilio($sid, $token);

// From - To - Body
$client->account->messages->sendMessage($_POST['From'], $_POST['To'], $_POST['Body']);

$host="localhost";
$port=3306;
$socket="";
$user="root";
$password="";
$dbname="locations";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

if ($result = $con->query("SELECT * FROM dog_locations")) {
    printf("Select returned %d rows.\n", $result->num_rows);

    /* free result set */
    $result->close();
}

//$con->close();


?>