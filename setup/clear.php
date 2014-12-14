<?php

error_reporting(E_ALL);

$db = new SQLite3(__DIR__ . "/../data/entries.db");

$db->exec("DELETE FROM entries;");

$db->close();

?>
