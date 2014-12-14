Use `php setup/install.php` to set up. Make sure that `data`
is `rwx` for your webserver (also check that `data/entries.db` is `rw`).

Use `php setup/clear.php` to clear entries in database.

Requires a fairly recent version of PHP.

Password can be changed in `data/password` (check that you do not have
any trailing newlines).

Make sure that your `data` and `setup` directories are protected.

`lib` must be exposed via the webserver, `inc` does not have to be (does not hurt if so).

