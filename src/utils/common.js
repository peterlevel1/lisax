import request from './request';
import generate from 'nanoid/generate';
import pathToRegexp from 'path-to-regexp';
import { API_PREFIX } from './constants';

export function isIndentType(type) {
  return /^object|array\[object\]$/.test(type);
}

export const getUniqueId = (function () {
  const ALPHABETS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const ID_KEY_NUM = 10;

  return function() {
    return generate(ALPHABETS, ID_KEY_NUM);
  }
})();

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

/**
 * find target node by an array
 * @param {Object} node the data node which should have children prop
 * @param {Array} arr the id list
 */
export function findTreeNode(node, arr = []) {
  let i = -1, length = arr.length, parent = node, children, k, kk;

  while (++i < length) {
    if (!parent) {
      return;
    }

    children = parent.children;
    if (!children || !Array.isArray(children) || !children.length) {
      return;
    }

    for (k = 0, kk = children.length; k < kk; k++) {
      if (children[k] && children[k].id === arr[i]) {
        parent = children[k];
        break;
      }
    }
  }

  if (i === length) {
    return parent;
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
      if (!options[p] && typeof options[p] !== 'number' && typeof options[p] !== 'boolean') {
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
    let defaultBody;

    // string or array
    const value = obj[key];
    if (typeof value === 'string') {
      if (/\s+/.test(value)) {
        const arr = value.split(/\s+/);
        method = arr[0];
        url = arr[1];
        if (arr[2]) {
          try {
            defaultBody = JSON.parse(arr[2]);
          } catch (e) {}
        }
      } else {
        url = value;
      }
    } else {
      method = value[0];
      url = value[1];
      defaultBody = value[2];
    }

    memo[key] = getService(method, url, defaultBody);

    return memo;
  }, {});
}

function getService(method, url, defaultBody) {
  const fn = pathToRegexp.compile(url);

  return function(body, pathObj) {
    const realUrl = fn(pathObj);
    return request(realUrl, {
      body: defaultBody ? { ...defaultBody, ...(body || {}) } : body,
      method
    });
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

export function getRestRequestObj(key, name, prefix = API_PREFIX) {
  const restKey = key[0].toUpperCase() + key.slice(1);
  const restName = name || key;

  return {
    [`add${restKey}`]: `POST /${prefix}/${restName}`,
    [`get${restKey}s`]: `GET /${prefix}/${restName}`,
    [`get${restKey}`]: `GET /${prefix}/${restName}/:id`,
    [`update${restKey}`]: `PUT /${prefix}/${restName}/:id`,
    [`del${restKey}`]: `DELETE /${prefix}/${restName}/:id`,
  };
}
