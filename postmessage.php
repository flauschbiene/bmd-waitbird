<?php

function handle($request, $tries = 0)
{
    $maxTries = 3;
    $maxLength = 500;
    $password = file_get_contents(__DIR__ . "/data/password");

    if (!isset($request['message']) || !isset($request['password']))
    {
        http_response_code(400);
        echo '{"error":"bad_request"}';
        return;
    }

    if ($request['password'] != $password)
    {
        http_response_code(200);
        echo '{"error":"access_denied"}';
        return;
    }

    $message = $request['message'];
    $time = time();

    if (strlen($message) > $maxLength * 3
        || !preg_match('/^[0-9a-z]+(,[0-9a-z]{1,2})+$/', $message))
    {
        http_response_code(400);
        echo '{"error":"bad_request"}';
        return;
    }

    try
    {
        $db = new SQLite3(__DIR__ . "/data/entries.db", SQLITE3_OPEN_READONLY);
        $stmt = $db->prepare("SELECT * FROM entries ORDER BY time DESC LIMIT 1");

        $result = $stmt->execute();

        $row = $result->fetchArray(SQLITE3_ASSOC);
        $db->close();

        if ($row['time'] + 10 > $time) {
            http_response_code(200);
            echo '{"error":"dont_spam"}';
            return;
        }

        $db = new SQLite3(__DIR__ . "/data/entries.db", SQLITE3_OPEN_READWRITE);
        $stmt = $db->prepare("INSERT INTO entries (time, message) VALUES (:time, :message)");

        $stmt->bindValue("time", $time);
        $stmt->bindValue("message", $message);

        $stmt->execute();
        $db->close();

        http_response_code(200);
        echo '{"status":"ok"}';
    }
    catch (Exception $exc)
    {
        $db->close();
        if ($tries < $maxTries)
        {
            handle($request, $tries + 1);
        }
        else
        {
            http_response_code(500);
            echo '{"status":"internal_server_error"}';
        }
    }
}

Header("Content-Type: application/json");
handle($_POST);
