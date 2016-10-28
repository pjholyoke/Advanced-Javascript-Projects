<?php
$ch = curl_init();

// Disable SSL verification
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// 
curl_setopt($ch, CURLOPT_URL, urldecode($_GET['url'])."&key=<nope>"); // Set url and add my API key to the end.

$profileData = curl_exec($ch); // Execute query
curl_close($ch); // Close connection.

echo $profileData; // Return user profile data.
?>