# user-ip
Simple NPM to know your user's IP Address

[![Build Status](https://travis-ci.org/shivarajnaidu/user-ip.svg?branch=master)](https://travis-ci.org/shivarajnaidu/user-ip)

## Install
(This Requires Node 4.x or Later...)

```
npm install user-ip --save
```

### API

userIP(req)

* `req` - REQUIRED: http/https server request object


## Usage

```js
'use strict';
const http = require('http');
const userIP = require('user-ip');

http.createServer(function (req, res) {
  const ip = userIP(req);
  res.end(ip);
}).listen(3000);
```



### Please Contribute And Improve It To Handle Much More Edge Cases..

Thank You!

