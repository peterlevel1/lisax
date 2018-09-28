import pathToRegexp from 'path-to-regexp';
import router from 'umi/router';
import services from '../services';
import { reducerSave, addKey, convertPath, matchRoute } from '../utils/common';
import { setCsrfToken } from '../utils/request';

const { getUser, login } = services;
const onUpdateLocation = matchRoute([
  { pathname: '/project', actionType: 'project/init' },
  { parser: convertPath('/project/:id'), actionType: 'currentProject/init' },
]);

function initApp(location, dispatch) {
  const { pathname } = location;

  if (['/login', '/register'].includes(pathname)) {
    return;
  }

  dispatch({ type: 'init' });
}

export default {
  namespace: 'app',

  state: {
    user: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      initApp(history.location, dispatch);

      history.listen(location => {
        onUpdateLocation(location, dispatch);
      });
    }
  },

  effects: {
    *init(action, { put, call }) {
      yield put({ type: 'getUser' });
    },

    *getUser(action, { call, put }) {
      const res = yield call(getUser);
      if (res.success) {
        yield put({
          type: 'update',
          payload: { user: res.data }
        });
        return;
      }

      if (res.needsLogin) {
        router.push('/login');
      }
    },

    *login({ payload }, { call, put }) {
      const res = yield call(login, payload);

      if (res.success) {
        // const { csrfToken } = res.data;
        // setCsrfToken(csrfToken);
        router.push('/');
      }
    }
  },

  reducers: { update: reducerSave }
};
