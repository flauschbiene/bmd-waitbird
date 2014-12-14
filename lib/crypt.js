$(function () {

    var cookieName     = "secret";
    var cookieExpires  = 1;
    var passwordCookie = "password";
    var updateInterval = 10 * 1000;
    var maxLength      = 500;
    var messagePast    = 2 * 60 * 60;

    var $post       = $("#post");
    var $loading    = $("#loading");
    var $error      = $("#error");
    var $secret     = $("#secret");
    var $password   = $("#password");
    var $message    = $("#message");
    var $messages   = $("#messages");
    var $post       = $("#post");
    var $goMessages = $("#goMessages");
    var $goPost     = $("#goPost");

    $message.attr('maxlength', maxLength);

    (function init() {
        var secret = $.cookie(cookieName);
        if (typeof secret !== "undefined") {
            $secret.val(secret);
        }
        var password = $.cookie(passwordCookie);
        if (typeof password !== "undefined") {
            $password.val(password);
        }
    }());
     
    var base = 36;
    var keyLength = 32;
    var table = "0123456789" +
        "abcdefghijklmnopqrstuvwxzy" +
        "ABCDEFGHIJKLMNOPQRSTUVWXZY" +
        "!@#$%^&*()_+-={}[]:\"|;'\\<>?,./~`" +
        "äüöÄÜÖß" +
        "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" +
        "абвгдежзийклмнопрстуфхцчшщъыьэюя" +
        "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ΢ΣΤΥΦΧΨΩ" +
        "αβγδεζηθικλμνξοπρςστυφχψω" +
        "אבגדהוזחטיךכלםמןנסעףפץצקרשת" +
        "\n\t" +
        "بةتثجحخدذرز";

    function chr(ord) {
        if (ord < 0 || ord >= table.length) {
            return ' ';
        }
        return table.charAt(ord);
    }

    function ord(chr) {
        var ord = table.indexOf(chr);
        return (ord === -1) ? table.length : ord;
    }

    function randInt(max) {
        return Math.floor(Math.random() * max);
    }

    function encrypt(secret, message) {
        
        if (message === "") {
            return "";
        }

        var text = [];
        var j = randInt(keyLength - 1) + 1;

        text.push(j.toString(base));

        for (var i = 0; i < message.length; i++) {
            var char = message.charAt(i);
            var c = ord(char);
            var s = ord(secret.charAt(j));
            var m = c ^ s;
            text.push(m.toString(base));

            j = (j + 1) % secret.length;
        }

        return text.join(",");
    }

    function decrypt(secret, message) {

        var codes = message.split(",");

        var text = [];
        var j = parseInt(codes[0], base);

        for (var i = 1; i < codes.length; i++) {
            var c = parseInt(codes[i], base);
            var s = ord(secret.charAt(j));

            text.push(chr(c ^ s));

            j = (j + 1) % secret.length;
        }

        return text.join("");
    }

    function send() {

        var message = $message.val();

        if (message.length < 1) {
            return;
        }
        $loading.show();
        doHash();

        var cipherText = encrypt($secret.val(), message);
        var password = $password.val();

        $.ajax({
            url: "postmessage.php",
            type: "POST",
            data: {
                message: cipherText,
                password: password
            }
        }).always(function () {
            $loading.hide();
        }).done(function (data) {
            if (data.error) {
                $error.text(data.error).show();
            } else {
                $message.val("");
                $.cookie(passwordCookie, password);
            }
        }).fail(function (data, status) {
            $error.text(status).show();
        });
    }

    function hash(word) {
        var hash = blake32(word);
        var text = [];

        for (var i = 0; i < hash.length; i += 2) {
            var c = hash.charAt(i) + hash.charAt(i + 1);
            var m = chr(parseInt(c, 16));
            text.push(m);
        }
        return text.join("");
    }

    function doHash() {
        var secret = $secret.val();
        if (secret === "") {
            return false;
        }
        if (secret.length != keyLength) {
            var theHash = hash(secret);
            $secret.val(theHash);
            $.cookie("secret", theHash, { expires: cookieExpires });
            return theHash;
        }
        return false;
    }

    function decryptAll() {
        var secret = $secret.val();
        if (secret === "") {
            return;
        }
        $(".encrypted").each(function () {
            var $elem = $(this);
            var text = decrypt(secret, $elem.attr("data-message"));
            var time = $elem.attr("data-time") * 1000;
            $("<div>").addClass("label").text(new Date(time)).appendTo($elem);
            $("<div>").addClass("elem").text(text).appendTo($elem);
            $elem.removeClass("encrypted").show();
        });
    }

    $secret.blur(function () {
        if (!doHash()) {
            return;
        }
        $messages.find(".message").each(function () {
            $(this).empty().addClass("encrypted");
        });
        decryptAll();
    });
    $post.on("submit", function () {
        setTimeout(send, 0);
        return false;
    });

    $goMessages.on("click", function () {
        $post.hide();
        $messages.show();
    });

    $goPost.on("click", function () {
        $messages.hide();
        $post.show();
    });

    $error.on("click", function () {
        $error.hide();
    });

    var lastUpdated = now() - messagePast;

    function go() {
        setTimeout(update, updateInterval);
    };

    function update() {
        $.ajax({
            url: "messages.php?since=" + lastUpdated
        }).done(function (data, status) {
            if (status === "success" && data.length) {
                for (var i = 0; i < data.length; i++) {
                    var message = data[i];
                    $("<div>")
                        .attr("data-time", message.time)
                        .attr("data-message", message.message)
                        .addClass("encrypted message")
                        .hide()
                        .prependTo($messages);
                }
                decryptAll();
            }
        }).always(function () {
            go();
        });
        lastUpdated = now();
    }

    update();

    $post.hide();
    $loading.hide();
});

