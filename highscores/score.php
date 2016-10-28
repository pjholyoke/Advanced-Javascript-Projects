<?php
  include ('database.php');

  if (isset($_GET['action']))
    $action = $_GET['action'];
  else
    $action = "list";

  try {
    switch($action) {
      case "list":
        $query = "SELECT uname, score FROM highscores";
        $statement = $db->prepare ($query);
        $success = $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(array('Result' => $rows));
        break;
      case "add":
        $uname = $_GET['uname'];
        $score = $_GET['score'];

        $query = "INSERT INTO highscores (uname, score) VALUES (:uname, :score)";
        $statement = $db->prepare ($query);
        $statement->bindParam(':uname', $uname);
        $statement->bindParam(':score', $score);
        $statement->execute();
    }
  } catch(PDOException $e) { die("Error: ".$e->getMessage()); }
?>