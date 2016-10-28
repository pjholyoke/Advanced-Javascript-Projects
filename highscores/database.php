<?php

/*
  If you want to test this yourself here's the SQL statement you need:
  
  CREATE TABLE  (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uname varchar(50) not null,
    score varchar(50) not null
  );
  
*/

  try {
    $host = gethostbyname('host_here');	
    $dsn = 'mysql:host='.$host.':<port>;dbname=<name>';

    $username = 'user_here';
    $password = 'password_here';
    $options = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);

    $db = new PDO($dsn, $username, $password, $options);
  } catch(Exception $e) { die($e); }
?>