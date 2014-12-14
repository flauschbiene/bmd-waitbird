<?php

error_reporting(E_ALL);
ini_set("zlib.output_compression", 4096);

Header("Cache-Control: private, max-age=0, no-cache");
Header("Content-Type: text/html");

?><!DOCTYPE html>
<html>
<head>
<title>Woopdiwoop</title>
<meta charset="UTF-8">
<style>
<?php readfile(__DIR__ . "/inc/style.css"); ?>
</style>
</head>

<body>

<div id="tool">

<div id="navigation">
    <button id="goMessages">Messages</button>
    <button id="goPost">Post</button>
</div>

<div class="label">Secret:</div>
<input class="elem" type="text" id="secret"
    autocomplete="off" autocorrect="off" autocapitalize="off">

<div id="messages">
    
</div>

<form id="post">
<div class="label">Passwort:</div>
<input type="password" value="" class="elem" id="password">
<div class="label">Message:</div>
<textarea class="elem" id="message"></textarea>
<input type="submit" value="Go!" class="elem" id="action">
</form>

</div>

<div id="loading">Loading...</div>
<div id="error" style="display: none"></div>

<script>

var now = (function () {

    function time() {
        return Math.floor(new Date().getTime() / 1000);
    }

    var nowClient = time();
    var nowServer = <?php echo time(); ?>
    
    var diff = nowClient - nowServer;

    return function () {
        var clientTime = time();
        return clientTime - diff;
    };    
}());

</script>
<script type="text/javascript" src="script.php"></script>

</body>
</html>
