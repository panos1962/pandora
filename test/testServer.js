"use strict";

const pandora = require('../lib/pandoraServer.js');
pandora.testServer();

var d = pandora.date(new Date());
d = pandora.date2date(d, 'YMD', '%D-%M-%Y');
console.log(d);
