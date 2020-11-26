# Axios(v0.21.0) 分析

讲什么挺重要，但更重要的是通过一个主题进行的交流，所以不好的地方、有异议的地方请随时打断

## 介绍
> Promise based HTTP client for the browser and node.js

支持浏览器和Nodejs的，基于Promise的HTTP客户端

key：
1. 平台差异：浏览器是通过XHR或者fetch进行请求，Nodejs则是通过引入http模块进行请求
2. Promise
3. HTTP：三次握手四次挥手

## main
```javascript
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);
  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);
  // Copy context to instance
  utils.extend(instance, context);
  return instance;
}
// Create the default instance to be exported
var axios = createInstance(defaults);
```
instance就指向了request方法，且上下文指向context
把Axios.prototype上的方法扩展到instance对象上，
这样 instance 就有了 get、post、put等方法
并指定上下文为context，这样执行Axios原型链上的方法时，this会指向context

把context对象上的自身属性和方法扩展到instance上（defaults和interceptors）

```javascript
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
```

```javascript
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
```


```javascript
Axios.prototype.request = function request(config) {
  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
  this.interceptors.request.forEach(function (interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function (interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
};
```
dispatchRequest是执行请求的
连接拦截器中间件
??为什么将config对象当作参数传给Promise.resolve方法
chain数组是用来盛放拦截器方法和dispatchRequest方法的，并且
??为什么chain要放一个undefined,因为chain总是成对去处理
??拦截器执行顺序
??promise这块的执行顺序
符合迭代的概念，但并不是迭代器的写法
添加了拦截器后的chain数组大概会是这样的：
```javascript
[
   requestFulfilledFn, requestRejectedFn, ...,
   dispatchRequest, undefined,
   responseFulfilledFn, responseRejectedFn, ...
]
```
数组的 shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
每次执行while循环，从chain数组里按序取出两项，并分别作为promise.then方法的第一个和第二个参数
对于请求拦截器，从拦截器数组按序读到后是通过unshift方法往chain数组数里添加的，又通过shift方法从chain数组里取出的，所以得出结论：对于请求拦截器，先添加的拦截器会后执行
对于响应拦截器，从拦截器数组按序读到后是通过push方法往chain数组里添加的，又通过shift方法从chain数组里取出的，所以得出结论：对于响应拦截器，先添加的拦截器先执行
第一个请求拦截器的fulfilled函数会接收到promise对象初始化时传入的config对象，而请求拦截器又规定用户写的fulfilled函数必须返回一个config对象，所以通过promise实现链式调用时，每个请求拦截器的fulfilled函数都会接收到一个config对象
第一个响应拦截器的fulfilled函数会接受到dispatchRequest（也就是我们的请求方法）请求到的数据（也就是response对象）,而响应拦截器又规定用户写的fulfilled函数必须返回一个response对象，所以通过promise实现链式调用时，每个响应拦截器的fulfilled函数都会接收到一个response对象
任何一个拦截器的抛出的错误，都会被下一个拦截器的rejected函数收到，所以dispatchRequest抛出的错误才会被响应拦截器接收到。
因为axios是通过promise实现的链式调用，所以我们可以在拦截器里进行异步操作，而拦截器的执行顺序还是会按照我们上面说的顺序执行，也就是 dispatchRequest 方法一定会等待所有的请求拦截器执行完后再开始执行，响应拦截器一定会等待 dispatchRequest 执行完后再开始执行。

```javascript
function InterceptorManager() {
  this.handlers = [];
}
InterceptorManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};
InterceptorManager.prototype.eject = function (id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
InterceptorManager.prototype.forEach = function (fn) {
  // ...
};
```
handlers存放拦截器方法，数组内每一项都是有两个属性的对象，两个属性分别对应成功和失败后执行的函数。
遍历this.handlers，并将this.handlers里的每一项作为参数传给fn执行
??unwatch你们会怎么实现
```javascript
InterceptorManager.prototype.use = function (fulfilled, rejected) {
  // ...
  const idx = this.handlers.length - 1;
  return function () {
    this.handlers[idx] = null
  }
};
```

```javascript
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then(function (response) {
    throwIfCancellationRequested(config);
    // ...
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      // ...
    }

    return Promise.reject(reason);
  });
};
```
adapter允许自定义处理请求

```javascript
function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open(config.method.toUpperCase(), url, true);
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) return;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(resolve, reject, response);
      request = null; // Clean up request
    };
    // onabort、onerror、ontimeout、onprogress(download、upload)事件
    // ... cancelToken ... Add xsrf header
    request.send(requestData);
  });
}
```
settle: Resolve or reject a Promise based on response status.
```javascript
// Add xsrf header
if (utils.isStandardBrowserEnv()) {
  var xsrfValue =
    (config.withCredentials || isURLSameOrigin(fullPath))
    && config.xsrfCookieName
    ? cookies.read(config.xsrfCookieName)
    : undefined;
  if (xsrfValue) {
    requestHeaders[config.xsrfHeaderName] = xsrfValue;
  }
}
```
只有onreadystatechange是标准事件onload、onerror、onprogress是浏览器的实现
readyState === 4 是请求完成
清理request是为什么？释放内存还是有其他意图？
withCredentials一个布尔值，用来指定跨域Access-Control请求是否应当带有授权信息，如cookie或授权header头。
xsrfCookieName是用作 xsrf token 的值的cookie的名称

## CSRF/XSRF（Cross-site request forgery）
跨站请求伪造，当正常用户还没有退出登陆还有效的情况下伪装成该受信任用户的请求进行一些恶意的访问操作

防御方法：
1. 检查Referer字段
2. 同步表单CSRF校验
3. 双重Cookie防御

双重 Cookie 防御 就是将 token 设置在 Cookie 中，在提交（POST、PUT、PATCH、DELETE）等请求时提交 Cookie，并通过请求头或请求体带上 Cookie 中已设置的 token，服务端接收到请求后，再进行对比校验。

始作俑者：浏览器的同源策略
img/video/source、form表单、iframe等

```javascript
if (config.cancelToken) {
  config.cancelToken.promise.then(function onCanceled(cancel) {
    if (!request) return;
    request.abort();
    reject(cancel);
    request = null; // Clean up request
  });
}
```
当promise被resolve时取消请求，那什么时候呢？肯定是我们调用取消时，

```javascript
const source = axios.CancelToken.source();
axios.get('/user/12345', {
  cancelToken: source.token
})
// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```
cancel和token可以看作是县令和拿着令牌的通信兵
```javascript
function CancelToken(executor) {
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      return; // Cancellation has already been requested
    }
    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function (c) { cancel = c; });
  return {
    token: token,
    cancel: cancel
  };
};
```
new Cancel(message)其实就是抛出一个包含取消信息的对象，而且只包含这个，而且通过toString直接提供输入错误信息字符串的便捷方式
??为什么搞那么复杂，而不是直接abord?或者简单点?因为axios对外输出的就是promise，只有resolve、reject，不能再挂载或者对外提供取消方法
那怎么办呢？要么不再提供promise的用法，但显然这不符合我们的使用习惯，并且取消的场景很少，这很不值得，那就只能向新对象提供取消的方法了，这也是axios的做法
是不是感觉这种写法很绕？可不可以直接将cancelhandle抛出去
对我们的封装有什么影响

```javascript
if (config.getCancelHandler) {
  config.getCancelHandler((msg) => {
    if (!request) return;
    request.abort();
    reject(msg);
    request = null; // Clean up request
  })
}
// use
let cancel;
const getCancelHandler = function (handler) {
  cancel = handler
}
axios.get('/user/12345', {
  getCancelHandler
})
// cancel the request (the message parameter is optional)
cancel('Operation canceled by the user.');
```

## 我们的实践

