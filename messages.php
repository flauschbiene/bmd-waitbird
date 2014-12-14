<?php

error_reporting(E_ALL);

Header("Cache-Control: private, max-age=0, no-store");
Header("Content-Type: application/json; charset=UTF-8");
header_remove("X-Powered-By");

function handle($request)
{
    $messages = [];

    if (!isset($request['since'])) {
        http_response_code(400);
        echo '{"error":"missing_parameter"}';
        return;
    }

    try
    {
        $db = new SQLite3(__DIR__ . "/data/entries.db", SQLITE3_OPEN_READONLY);

        $stmt = $db->prepare("SELECT * FROM entries WHERE time >= :since ORDER BY time");
        $stmt->bindValue("since", (int) $request['since']);
        
        $result = $stmt->execute();

        while ($row = $result->fetchArray(SQLITE3_ASSOC))
        {
            $messages[] = $row;
        }
        $db->close();

        if (count($messages) > 1) {
            ini_set("zlib.output_compression", 4096);
        }
        http_response_code(200);
        echo json_encode($messages);
    }
    catch (Exception $exc)
    {
        http_response_code(500);
        echo json_encode($exc);
    }
}

handle($_GET);
