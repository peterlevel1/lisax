import { message } from 'antd';
import fetch from 'dva/fetch';
import { delEmptyParams } from './common';
import qs from 'querystring';

const ERROR_TEXT = '系统异常，请稍后再试';

export default function request(url, options = {}) {
  const { requestUrl, requestOptions } = normalizeOptions(url, options);

  return fetch(requestUrl, requestOptions)
    .then(checkStatus)
    .then((res) => res.text())
    .then((text) => handleResponseText(url, text))
    .catch(err => handleResponseText(url, getErrorText(`处理出错: ${err.message}`)));
}

function normalizeOptions(url, options) {
  let requestUrl = url, requestOptions = { ...options };

  // omit: 默认值，忽略cookie的发送
  // same-origin: 表示cookie只能同域发送，不能跨域发送
  // include: cookie既可以同域发送，也可以跨域发送
  requestOptions.credentials = requestOptions.credentials || 'same-origin';
  requestOptions.method = requestOptions.method || 'GET';

  if (!requestOptions.headers) {
    if (requestOptions.method === 'GET') {
      requestOptions.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };
      if (requestOptions.body) {
        requestUrl = url + '?' + qs.stringify(requestOptions.body);
        delete requestOptions.body;
      }
    } else if (['POST', 'PUT', 'DELETE'].includes(requestOptions.method)) {
      requestOptions.headers = {
        'Content-Type': 'application/json; charset=UTF-8'
      };
      requestOptions.body = JSON.stringify(delEmptyParams(requestOptions.body || {}));
    }
  }

  return { requestUrl, requestOptions };
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  return { text: getErrorText };
}

function getErrorText(text) {
  return `{"success": false, "message": "${text || ERROR_TEXT}"}`;
}

function parseText(text) {
  if (!text || typeof text !== 'string') {
    return;
  }

  let ret;
  try {
    ret = JSON.parse(text.trim());
  } catch (err) {
    throw err;
  }

  return ret;
}

function handleResponseText(url, text) {
  const ret = parseText(text) || {};

  // TODO: 设定特定的 service 处理这个问题
  // if (ret.redirectUrl) {
  //   location.href = ret.redirectUrl;
  //   return;
  // }

  // 成功或者失败，只要有message, 就显示出来
  if (ret.message) {
    const method = ret.success ? 'success' : 'error';
    message[method](ret.message);
  }

  return ret;
}
