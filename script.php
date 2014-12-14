<?php

ini_set("zlib.output_compression", 4096);

Header("Cache-Control: public, max-age=86400");
Header("Content-Type: application/javascript; charset=utf-8");

if (file_exists(__DIR__ . "/script.min.js")) {
    readfile(__DIR__ . "/script.min.js");
} else if (file_exists(__DIR__ . "/script.js")) {
    readfile(__DIR__ . "/script.js");
} else {
    readfile(__DIR__ . "/lib/blake.js");
    readfile(__DIR__ . "/lib/jquery.js");
    readfile(__DIR__ . "/lib/jquery.cookie.js");
    readfile(__DIR__ . "/lib/crypt.js");
}
