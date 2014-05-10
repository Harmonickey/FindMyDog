<?php
// Get the PHP helper library from twilio.com/docs/php/install
require_once('twilio-php/Services/Twilio.php'); // Loads the library
 
// Your Account Sid and Auth Token from twilio.com/user/account
$sid = "AC461d3f5fa9b34098d83e19417d88608c"; 
$token = "93e934c729223531780d8a0851d14ab3"; 
$client = new Services_Twilio($sid, $token);
 
// From - To - Body
$client->account->messages->sendMessage("+12692042709", "(269) 267-3752", "Your Dog is running away!");

?>