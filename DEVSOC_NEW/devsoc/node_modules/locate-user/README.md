# locate-user
Know Your Client's Location


[![Build Status](https://travis-ci.org/shivarajnaidu/locate-user.svg?branch=master)](https://travis-ci.org/shivarajnaidu/locate-user)

## Install
(This Requires Node 4.x or Later...)

```
npm install locate-user --save
```

### API

locateUser(req)

* `req` - REQUIRED: http/https server request object


## Usage

```js
'use strict';
const http = require('http');
const locateUser = require('locate-user');

http.createServer(function(req, res) {

    const userLocation = locateUser(req);
    userLocation
        .then(data => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        })
        .catch(error => {
            console.error(error)
        });
}).listen(3000);

```
## Usage (Using Express.JS)

```js
'use strict';
const express = require('express');
const locateUser = require('locate-user');

const app = express();

app.get('/', (req, res, next) => {
    const userLocation = locateUser(req);
    userLocation
        .then(data => res.json(data))
        .catch(next);
});

app.listen(3000)

```

### Please Contribute And Improve It..

Thank You!

