localnote
=========

Running it
----------

Just check it out into the content space of your favorite web server.

Or: run a small python webserver to serve up the content. Do this with the commands:

> $ pip install -r serve.req
> $ paster serve serve.ini

This will start a web server listening on port 8088 that will have the current directory as its document root. You can access the localnote pages at:

> http://localhost:8088/localnote.html
