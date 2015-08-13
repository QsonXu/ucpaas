"use strict";

var assign = require('object-assign');
var request = require('co-request');
var crypto = require('crypto');
var dateFormat = require('dateformat');

var api = {
  sms: 'Messages/templateSMS',
  voice: 'Calls/voiceCode',
  callBack: 'Calls/callBack',
  callCancel: 'Calls/callCancel',
  roamOpen: 'Roam/Open',
  roamClose: 'Roam/Close'
};

function UCPaas(opt) {
  if (!(this instanceof UCPaas)) {
    return new UCPaas(opt);
  }

  opt = opt || {};

  if (!opt.accountSid || !opt.token || !opt.appId) {
    throw('accountSid, token and appId is required, please check config');
  }

  this.host = 'https://api.ucpaas.com';
  this.version = '2014-06-30';
  this.accountSid = opt.accountSid;
  this.token = opt.token;
  this.appId = opt.appId;
}

UCPaas.prototype.Post = function* (api, params) {
  var auth = this.auth();

  var url = `${this.host}/${this.version}/Accounts/${this.accountSid}/${api}?sig=${auth.sig}`;

  var result = yield request({
    uri: url,
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
      'Authorization': auth.authorization
    },
    body: params
  });

  return result.body;
};

UCPaas.prototype.sms = function*() {
  var params = assign(arguments[0], {appId: this.appId});
  return yield this.Post(api.sms, {"templateSMS": params});
};

UCPaas.prototype.voice = function* () {
  var params = assign(arguments[0], {appId: this.appId});
  return yield this.Post(api.voice, {"voiceCode": params})
};

/**
 * Only company account cant use.
 * @returns {body|{templateSMS}|{voiceCode}|{callback}|HTMLElement}
 */
UCPaas.prototype.callBack = function* () {
  var params = assign(arguments[0], {appId: this.appId});
  return yield this.Post(api.callBack, {"callback": params});
};

UCPaas.prototype.callCancel = function* (callId) {
  var auth = this.auth();

  var result = yield request({
    uri: `${this.host}/${this.version}/Accounts/${this.accountSid}/${api}?sig=${auth.sig}&appId=${this.appId}&callId=${callId}`,
    method: 'GET',
    json: true,
    headers: {
      'content-type': 'application/json',
      Authorization: auth.authorization
    }
  });

  return result.body
};

UCPaas.prototype.roamOpen = function*() {
  var params = assign(arguments[0], {appId: this.appId});
  return yield this.Post(api.roamOpen, {"roam": params});
};

UCPaas.prototype.roamClose = function*() {
  var params = assign(arguments[0], {appId: this.appId});
  return yield this.Post(api.roamClose, {"roam": params});
};

UCPaas.prototype.auth = function auth() {

  var now = new Date();

  /**
   * To china TimeZone
   */
  if (now.getTimezoneOffset()) {
    now = now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + (8 * 60 * 60 * 1000);
  }

  var timestamp = dateFormat(now, 'yyyyMMddHHmmss');
  var shasum = crypto.createHash('md5');
  shasum.update(`${this.accountSid}${this.token}${timestamp}`);

  var authorization = new Buffer(`${this.accountSid}:${timestamp}`).toString('base64');
  return {
    sig: shasum.digest('hex').toUpperCase(),
    authorization: authorization
  }
};

module.exports = UCPaas;