import { message } from 'antd';
import fetch from 'dva/fetch';
import statusCodes from './status-codes';
import { delEmptyParams } from './common';
import qs from 'querystring';

let csrfToken = '';
const ERROR_TEXT = '系统异常，请稍后再试';

export default function request(url, options = {}) {
  const { requestUrl, requestOptions } = normalizeOptions(url, options);

  return fetch(requestUrl, requestOptions)
    .then(onResponse)
    .catch(err => {
      message.error(`${requestOptions.method} ${url}: ${err.message}`);
    });
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
        'Content-Type': 'application/json; charset=UTF-8',
        // 'X-CSRF-Token': csrfToken
      };
      requestOptions.body = JSON.stringify(delEmptyParams(requestOptions.body || {}));
    }
  }

  return { requestUrl, requestOptions };
}

async function onResponse(response) {
  let ret;

  if (response.status >= 200 && response.status < 300) {
    if ([ 201, 204 ].includes(response.status)) {
      ret = { success: true };
    }

    if (!ret) {
      ret = await response.text();
      ret = parseText(ret) || {};
    }
  }

  if (ret && ret.message) {
    const method = ret.success ? 'success' : 'error';
    message[method](ret.message);
    return;
  }

  if (response.status >= 400) {
    message.error(statusCodes[response.status] || ERROR_TEXT);
  }

  return ret;
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

export function setCsrfToken(token) {
  csrfToken = token;
}
