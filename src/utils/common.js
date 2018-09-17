import request from './request';
import generate from 'nanoid/generate';
import pathToRegexp from 'path-to-regexp';

export function isIndentType(type) {
  return /^object|array\[object\]$/.test(type);
}

const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ID_KEY_NUM = 6;
export function getUniqueId() {
  return generate(ALPHABETS, ID_KEY_NUM) + ('_' + Date.now());
}

export function convertPath(path) {
  const tokens = [];
  const re = pathToRegexp(path, tokens);

  return function(str) {
    const ret = re.exec(str);
    if (!ret || !tokens.length) {
      return null;
    }

    const arr = ret.slice(1);
    return tokens.reduce((memo, item, i) => {
      const value = arr[i];
      const key = item.name;
      memo[key] = value;

      return memo;
    }, {});
  }
}

export function findIndex(arr, cb) {
  for (let i = 0, ii = arr.length; i < ii; i++) {
    if (cb(arr[i], i)) {
      return i;
    }
  }
}

export function walkTree(tree, cb) {
  if (!tree) {
    return;
  }

  if (Array.isArray(tree)) {
    return walkChildren(tree, cb);
  }

  const ret = cb(tree, -1);
  if (ret !== undefined) {
    return ret;
  }

  if (Array.isArray(tree.children)) {
    return walkChildren(tree.children, cb);
  }
}

function walkChildren(children = [], cb) {
  let ret;

  for (let i = 0, ii = children.length; i < ii; i++) {
    ret = cb(children[i], i);
    if (ret !== undefined) {
      return ret;
    }

    if (children[i].children) {
      ret = walkChildren(children[i].children, cb);
      if (ret !== undefined) {
        return ret;
      }
    }
  }
}

export function addKey(obj) {
  if (!obj) {
    return;
  }

  if (Array.isArray(obj)) {
    return obj.map((item, i) => {
      item.key = i + '';
      return item;
    });
  }
}

export function reducerSave(state, { payload = {} }) {
  return { ...state, ...payload };
}

export function delEmptyParams(options = {}) {
  for (let p in options) {
    if (Object.hasOwnProperty.call(options, p)) {
      if (typeof options[p] !== 'number' && !options[p]) {
        delete options[p];
      }
    }
  }

  return options;
}

export function getSimpleServices(obj) {
  return Object.keys(obj).reduce((memo, key) => {
    let method = 'GET';
    let url;

    // string or array
    const value = obj[key];
    if (typeof value === 'string') {
      if (/\s+/.test(value)) {
        const arr = value.split(/\s+/);
        method = arr[0];
        url = arr[1];
      } else {
        url = value;
      }
    } else {
      method = value[0];
      url = value[1];
    }

    memo[key] = getService(method, url);

    return memo;
  }, {});
}

function getService(method, url) {
  const fn = pathToRegexp.compile(url);

  return function(body, pathObj) {
    const realUrl = fn(pathObj);
    return request(realUrl, { body, method });
  }
}

export function matchRoute(routes) {
  return function (location, dispatch) {
    const pathname = location.pathname;
    let item, parsed;

    for (let i = 0, ii = routes.length; i < ii; i++) {
      item = routes[i];

      if (item.pathname && item.pathname === pathname) {
        dispatch({
          type: item.actionType,
          location
        });
        break;
      }

      if (item.parser) {
        parsed = item.parser(pathname);

        if (parsed) {
          dispatch({
            type: item.actionType,
            payload: parsed,
            location
          });
          break;
        }
      }
    }
  }
}
