<?php

error_reporting(E_ALL);

$db = new SQLite3(__DIR__ . "/../data/entries.db");

$db->exec("CREATE TABLE entries (time INTEGER, message TEXT);");

$db->close();

?>
