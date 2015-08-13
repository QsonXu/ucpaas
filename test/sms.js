"use strict";
var co = require('co');

var UCPaas = require('../lib/ucpaas');

co(function* () {


  var ucpaas = UCPaas({
    accountSid: 'accountSid',
    token: 'token',
    appId: 'appId'
  });

  var result = yield ucpaas.sms({
    "param": "AppName,1024,1",
    "templateId": "1234",
    "to": "18512345678"
  });

  console.log('result: ', result);
});



