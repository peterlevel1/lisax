import { message } from 'antd';
import fetch from 'dva/fetch';
import { delEmptyParams } from './common';
import qs from 'querystring';

const ERROR_TEXT = '系统异常，请稍后再试';

export default function request(url, options = {}) {
  return fetch(url, normalizeOptions(options))
    .then(checkStatus)
    .then((res) => res.text())
    .then((text) => handleResponseText(url, text))
    .catch(err => handleResponseText(url, getErrorText(`处理出错: ${err.message}`)));
}

function normalizeOptions(options) {
  // omit: 默认值，忽略cookie的发送
  // same-origin: 表示cookie只能同域发送，不能跨域发送
  // include: cookie既可以同域发送，也可以跨域发送
  options.credentials = options.credentials || 'same-origin';

  if (!options.headers) {
    if (options.method === 'GET') {
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };

      if (options.body) {
        options.url = options.url + '?' + qs.stringify(options.body);
        delete options.body;
      }
    } else if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
      options.headers = {
        'Content-Type': 'application/json; charset=UTF-8'
      };
      options.body = JSON.stringify(delEmptyParams(options.body || {}));
    }
  }

  return options;
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

  if (ret.success !== true) {
    message.error(ret.message || `${ERROR_TEXT}`);
  }

  return ret;
}
