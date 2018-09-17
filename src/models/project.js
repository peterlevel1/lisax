import services from '../services';
import { reducerSave, addKey } from '../utils/common';

const { getProjects } = services;

export default {
  namespace: 'project',

  state: {
    data: [],
  },

  effects: {
    *init(action, { call, put }) {
      const res = yield call(getProjects);
      if (res.success) {
        yield put({
          type: 'update',
          payload: { data: addKey(res.data) }
        });
      }
    },
  },

  reducers: { update: reducerSave }
};
