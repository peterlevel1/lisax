import pathToRegexp from 'path-to-regexp';
import router from 'umi/router';
import services from '../services';
import { reducerSave, addKey, convertPath, matchRoute } from '../utils/common';

const { getUser } = services;
const onUpdateLocation = matchRoute([
  { pathname: '/project', actionType: 'project/init' },
  { parser: convertPath('/project/:id'), actionType: 'currentProject/init' },
]);

export default {
  namespace: 'app',

  state: {
    user: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'init' });

      history.listen(location => {
        onUpdateLocation(location, dispatch);
      });
    }
  },

  effects: {
    *init(action, { put }) {
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
    }
  },

  reducers: { update: reducerSave }
};
