import services from '../services';
import { reducerSave, addKey, findTreeNode } from '../utils/common';
import { NODE_TYPE_ROOT, NODE_TYPE_FOLDER, NODE_TYPE_HTTPDOC } from '../utils/constants';

function getTree(res) {
  const { id, name, desc } = res.data;

  return {
    // 2个 表
    id,
    title: name,
    key: `${NODE_TYPE_ROOT}_${id}`,
    type: NODE_TYPE_ROOT,
    desc,
    children: [],
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
    tree: getTree({
      data: { id: '',  name: '', desc: '' }
    }),
  },

  effects: {
    *init({ payload }, { call, put, select }) {
      // payload is { id }
      const res = yield call(services.getProject, null, payload);
      if (res.success) {
        yield put({
          type: 'update',
          payload: {
            data: res.data,
            tree: getTree(res)
          }
        });

        yield put({
          type: 'getProjectFolders',
          payload
        })
      }
    },

    *getProjectFolders({ payload }, { call, put }) {
      const res = yield call(services.getProjectFolders, null, payload);

      if (res.success) {
        yield put({
          type: 'updateProjectFolders',
          payload: res.data.map(node => {
            node.type = NODE_TYPE_FOLDER;
            node.key = `${NODE_TYPE_FOLDER}_${node.id}`;
            return node;
          })
        });
      }
    },

    *getNode({ payload }, { call, put }) {

    },

    *addNode({ payload }, { call, put }) {

    },

    updateNode({ payload }, { call, put }) {

    },

    *delNode({ payload }, { call, put }) {

    },

    *onSelectNode({ payload }, { call, put }) {
      const { node } = payload;

      if (!node || node.loaded) {
        yield put({
          type: 'updateTreeSelectedNode',
          payload: node
        });

        return;
      }

      if (node.type === NODE_TYPE_FOLDER) {
        node.loading = true;
        yield put({ type: 'freshTree' });

        const res = yield call(services.getProjectFolderChildren, null, { id: node.id });
        if (res.success) {
          node.children = res.data.map(one => {
            one.loaded = true;
            one.type = NODE_TYPE_HTTPDOC;
            one.key = `${NODE_TYPE_HTTPDOC}_${node.id}`;
            return one;
          });
        }

        node.loading = false;
        node.loaded = true;

        yield put({
          type: 'updateTreeSelectedNode',
          payload: node
        });
      }
    },

    extrangeNodes({ payload }, { call, put }) {},

    *updateProject({ payload }, { call, put }) {
      const { pathObj, params } = payload;
      const res = yield call(updateProject, params, pathObj);
      if (res.success) {
        console.log('save success');
      }
    }
  },

  reducers: {
    update: reducerSave,

    freshTree(state) {
      return { ...state, tree: { ...state.tree } };
    },

    updateProjectFolders(state, { payload }) {
      const { tree } = state;

      tree.children = payload;

      return { ...state, tree: { ...tree } };
    },

    updateTreeSelectedNode(state, { payload }) {
      const tree = state.tree;
      const node = payload;

      if (node && node.type === NODE_TYPE_FOLDER) {
        tree.expandedKeys = [ node.key ];
      }

      tree.selectedNode = node;

      return { ...state, tree: { ...tree } };
    },
  }
};
