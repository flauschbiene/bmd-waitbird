build:
	mkdir -p data
	touch data/entries.db
	chmod a+rwx data data/entries.db
	cat lib/blake.js lib/jquery.js lib/jquery.cookie.js lib/crypt.js > script.js
	uglifyjs script.js -c -m > script.min.js

