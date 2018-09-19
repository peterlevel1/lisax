import services from '../services';
import { reducerSave, addKey, findTreeNode } from '../utils/common';
import { NODE_TYPE_ROOT, NODE_TYPE_FOLDER, NODE_TYPE_HTTPDOC } from '../utils/constants';

const { getProjectById, updateProject, getNodeChildren } = services;

function getTree(res) {
  const { id, name, desc, content } = res.data;

  return {
    id,
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

const NAMESPACE = 'currentProject';

export default {
  namespace: NAMESPACE,

  state: {
    data: null,
    tree: null,
  },

  effects: {
    *init({ payload }, { call, put, select }) {
      // payload is { id }
      payload.id = +payload.id;

      const res = yield call(getProjectById, null, payload);
      if (res.success) {
        yield put({
          type: 'update',
          payload: {
            data: res.data,
            tree: getTree(res)
          }
        });

        yield put({
          type: 'getNodeChildren',
          payload
        })
      }
    },

    *getNodeChildren({ payload }, { call, put }) {
      const res = yield call(getNodeChildren, null, payload);
      if (res.success) {
        yield put({
          type: 'updateNodeChildren',
          payload: {
            id: payload.id,
            children: res.data.map(item => {
              item.title = item.name;
              return item;
            })
          }
        });
      }
    },

    *addNode({ payload }, { call, put }) {

    },

    updateNode({ payload }, { call, put }) {

    },

    *delNode({ payload }, { call, put }) {

    },

    extrangeNodes({ payload }, { call, put }) {},

    *save({ payload }, { call, put }) {
      const { pathObj, params } = payload;
      const res = yield call(updateProject, params, pathObj);
      if (res.success) {
        console.log('save success');
      }
    }
  },

  reducers: {
    update: reducerSave,

    // only update tree or folder children
    updateNodeChildren(state, { payload }) {
      const { id, children } = payload;
      const { tree } = state;

      if (id === tree.id) {
        tree.children = children;
      } else {
        const node = findTreeNode(tree, [ id ]);
        node.children = children;
      }

      return { ...state, tree: { ...tree } };
    }
  }
};
