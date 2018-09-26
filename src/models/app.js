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
      const res = yield call(services.ab);
      if (res.success) {
        console.log('res a.b', res);
      }
    },

    *getUser(action, { call, put }) {
      const res = yield call(getUser);
      console.log('getUser res', res);

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
      console.log('login payload', payload);
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
