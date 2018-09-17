import services from '../services';
import { reducerSave, addKey } from '../utils/common';
import { NODE_TYPE_ROOT, NODE_TYPE_FOLDER, NODE_TYPE_HTTPDOC } from '../utils/constants';

const { getProjectById, updateProject } = services;

function getTree(res) {
  const { id, name, desc, content } = res.data;

  return {
    id: id + '',
    title: name,
    desc,
    type: NODE_TYPE_ROOT,
    children: content ? JSON.parse(content) : [],
    selectedNode: null,
    // antd tree props
    expandedKeys: [],
    // selectedKeys: [],
    autoExpandParent: true,
    selectedRecords: [],
  };
}

export default {
  namespace: 'currentProject',

  state: {
    data: null,
    tree: null,
  },

  effects: {
    *init({ payload }, { call, put }) {
      const res = yield call(getProjectById, null, payload);
      if (res.success) {
        yield put({
          type: 'update',
          payload: {
            data: res.data,
            tree: getTree(res)
          }
        });
      }
    },

    *save({ payload }, { call, put }) {
      const { pathObj, params } = payload;
      const res = yield call(updateProject, params, pathObj);
      if (res.success) {
        console.log('save success');
      }
    }
  },

  reducers: { update: reducerSave }
};
