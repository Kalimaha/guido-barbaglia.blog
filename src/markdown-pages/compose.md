---
slug: "/compose"
date: "2016-12-11"
title: "Simple client/server architecture with Docker Compose"
description: "We will build a simple client/server architecture and then use Docker Compose to incapsulate the various components for the deployment."
image: "compose.webp"
---

# Simple client/server architecture with Docker Compose

This post builds on the [previous one](http://guido-barbaglia.blog/posts/use_docker_to_run_flask_based_rest_services.html) to create a simple
client/server architecture for a web-app developed with
[Flask](http://flask.pocoo.org/), for the back-end, and
[RequireJS](http://requirejs.org/), for the front-end. These two components will
be incapsulated with [Docker Compose](https://docs.docker.com/compose/) in order
to be ready for deployment.

<hr>

## Architecture

The web-app is composed by a back-end, made of a main
[Flask](http://flask.pocoo.org/) REST service and an additional
[Blueprint](http://flask.pocoo.org/docs/0.10/blueprints/), and a front-end module
developed with [RequireJS](http://requirejs.org/). A
[Docker](https://www.docker.com/) module will be created for both the client
and the server side of the application.

<img class="mx-auto d-block" src="/images/docker_compose_01.webp" width="50%" height="50%" alt="Docker compose 1" style="background-color: #fdf5eb;" />

<br>

The two will be linked together through Docker Compose and the final user
experience will be not affected by this setup.

<img class="mx-auto d-block" src="/images/docker_compose_02.webp" width="50%" height="50%" alt="Docker compose 2" style="background-color: #fdf5eb;" />

<hr>

## Source code

The source code of all the projects used in this tutorial is available on GitHub:
feel free to download, fork and/or star it!

<table class="table">
  <thead>
    <tr>
      <th>Project</th>
      <th>URL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Simple Flask UI</td>
      <td><a href="https://github.com/Kalimaha/simple_flask_ui">https://github.com/Kalimaha/simple_flask_ui</a></td>
    </tr>
    <tr>
      <td>Simple Flask Docker Composer</td>
      <td><a href="https://github.com/Kalimaha/simple_flask_docker_composer">https://github.com/Kalimaha/simple_flask_ui</a></td>
    </tr>
  </tbody>
</table>

<br>

## RequireJS client

[RequireJS](http://requirejs.org/) is a JavaScript file and module loader that
implements the [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition).
The simple client module implemented for this example has a `main.js` file,
that defines the required libraries and starts the component, and an
`application.js` script that implements the business logic of the front-end. The
filesystem of the project is shown in the following schema:

```bash
simple_flask_ui/
├── css
│   ├── bootstrap.min.css
│   ├── select2.min.css
│   ├── simple-flask-ui.css
│   └── sweet-alert.css
├── html
│   └── templates.hbs
├── index.html
├── js
│   ├── application.js
│   ├── main.js
│   └── libs
│       └── 3rd Party JavaScript Libraries
└── nls
    └── JavaScript files to implement I18N
```

As specified in the `index.html` file, the application loads RequireJS and
execute the `main.js` file:

```html
<script data-main="js/main" src="js/libs/require.js"></script>
```

This script declares the implemented modules (_in paths_), loads the required
libraries (_through the `baseUrl`_), specifies their mutual dependencies
(_in shim_) and starts the `application.js` module:

```javascript
require.config({
  baseUrl: "js/libs",

  paths: {
    application: "../../",
    APPLICATION: "../application",
  },

  shim: {
    bootstrap: ["jquery"],
    backbone: {
      deps: ["jquery", "underscore"],
      exports: "Backbone",
    },
    highcharts: ["jquery"],
    underscore: {
      exports: "_",
    },
  },
});

require(["APPLICATION"], function (APP) {
  /* Initiate components. */
  var app = new APP();

  /* Initiate the application. */
  app.init();
});
```

The `application.js` module loads a Handlebars template containing an input
field and two buttons: the first one will invoke the main REST service, while
the second is linked to the Blueprint. The base URL for the AJAX calls has
been set to `http://localhost:5000/`, that is the address exposed by Docker
for Flask, as seen in the [previous post](http://guido-barbaglia.blog/posts/use_docker_to_run_flask_based_rest_services.html). The business logic of the
front-end is very simple and is described in the schema below:

<img class="mx-auto d-block" src="/images/docker_compose_03.webp" width="50%" height="50%" alt="Docker compose 3" style="background-color: #fdf5eb;" />

<hr>

## Docker Compose

As per the official documentation "_Compose is a tool for defining and running
multi-container applications with Docker_". The
[Simple Flask Docker Composer](https://github.com/Kalimaha/simple_flask_docker_composer)
project contains two folders, one with the definition of the front-end
[Docker](https://www.docker.com/) image, one for the back-end, and a
`docker-compose.yml` file that tells
[Docker Compose](https://docs.docker.com/compose/) how to handle the two images.
The client side image is built starting from [Ubuntu](http://www.ubuntu.com/),
to which [Apache](http://httpd.apache.org/) and the source code are then added:

```docker
# Create a container from Ubuntu.
FROM ubuntu:14.04

# Update Ubuntu repositories.
RUN apt-get update

# Install Apache.
RUN apt-get -y install apache2

# Install unzip.
RUN apt-get -y install wget
RUN apt-get -y install unzip

# Get and unzip sources.
RUN wget https://github.com/Kalimaha/simple_flask_ui/archive/master.zip
RUN unzip master.zip
RUN mv simple_flask_ui-master/ /var/www/html/simple_flask_ui
```

The final step is the definition of the `docker-compose.yml` file, in which we
specify that there are two volumes called client and server. For each module
Docker Compose will run the Docker build:

```bash
build: ./server
```

and

```bash
build: ./client
```

Each volume specifies which are the ports that need to be exposed: `5000` for
the server and `9999` for the client. In addition to that for each volume
there is a command instruction specified, that will be executed once Docker
Compose is up. Finally, the links directive tells Docker Compose to link the
server and the client volumes. The complete `docker-compose.yml` file is shown
below:

```yaml
server:
  build: ./server
  ports:
    - "5000:5000"
  command: "/deployment/env/bin/python /deployment/start.py"
  links:
    - client
client:
  build: ./client
  ports:
      - "9999:80"
  command: "/usr/sbin/apache2ctl -D FOREGROUND"
```

Time to build the project:

```bash
docker-compose build
```

and finally run it:

```bash
docker-compose up
```

Once the project is up and running it is possible to visit the UI at the
following URL: [http://localhost:9999/simple_flask_ui](http://localhost:9999/simple_flask_ui).
