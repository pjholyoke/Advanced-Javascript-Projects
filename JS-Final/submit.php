<?php

$data = array();

if(isset($_GET['files']))
{  
  $error = false;
  $files = array();

  $uploaddir = './uploads/';
  foreach($_FILES as $file)
  {
    if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name'])))
      $files[] = $uploaddir .$file['name'];
    else
      $error = true;
  }
}

?>