# ucpaas
A third part node.js module for ucpaas (云之讯 http://www.ucpaas.com)


#Install

`npm install ucpaas`

#Usage

```
var UCPaas = require('ucpaas');

var ucpaas = UCPaas({
  'accountSid': 'your accountSid',
  'token': 'your token',
  'appId': 'you app id'
});
```
if your sms template is below.

>您注册{1}网站的验证码为{2}，请于{3}分钟内正确输入验证码

```
var result = yield ucpaas.sms({
  'param': 'UCPaaS,1024,1',
  'templateId': '1234',
  'to': '18812345678'
});


```

Actually, you can use parameter in ucpaas documentation, give the method that your call, except `appId`.

#Notice
This module only support base api contain sms,voice,callBack,callCancel,roamOpen and roamClose now.
