<?php
$servername = "www.db4free.net";
$username = "ghartono";
$password = "asdfasdf";

try {
    $conn = new PDO("mysql:host=$servername;dbname=myDB", $username, $password);
    echo "Connected successfully"; 
    }
catch(PDOException $e)
    {
    echo "a";
    }
?>