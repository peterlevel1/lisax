import services from '../services';
import { reducerSave, addKey, findTreeNode } from '../utils/common';
import { NODE_TYPE_ROOT, NODE_TYPE_FOLDER, NODE_TYPE_HTTPDOC } from '../utils/constants';

function getTree(res) {
  const { id, name, desc } = res.data;

  return {
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

function createNode(parent) {
  const type = parent.type === NODE_TYPE_ROOT ? NODE_TYPE_FOLDER : NODE_TYPE_HTTPDOC;
  const id = `${parent.id}-${parent.children.length}`;
  const key = `${type}_${id}`;
  const ret = {
    // ---------------------
    id,
    parentId: parent.id,
    title: '',
    desc: '',
    // ---------------------
    type,
    key,
    _loaded: false,
    _loading: false,
    _creating: true,
    _inputing: true,
    _title: '',
    // ---------------------
  };

  switch (ret.type) {
    case NODE_TYPE_FOLDER:
      ret.children = [];
    break;

    case NODE_TYPE_HTTPDOC:
      ret.data = {
        id: id.replace(/-/g, '_'),
        requestMethod: 'POST',
        requestUrl: '',
        desc: '',
        requestHeader: [],
        requestParams: [],
        responseHeader: [],
        responseParams: [],
      };
    break;
  }

  return ret;
}

function getDefaultState() {
  return {
    data: null,
    tree: getTree({
      data: { id: '',  name: '', desc: '' }
    }),
    // 配置
    config: null,
  };
}

const NAMESPACE = 'currentProject';

export default {
  namespace: NAMESPACE,

  state: getDefaultState(),

  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'initState' });
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
          type: 'getFolders',
          payload: { parentId: payload.id }
        })
      }
    },

    *getFolders({ payload }, { call, put }) {
      const res = yield call(services.getProjectFolders, payload);

      if (res.success) {
        yield put({
          type: 'updateFolders',
          payload: res.data
        });
      }
    },

    // ---------------------------------

    *getFolder({ payload }, { call, put }) {

    },

    *addFolder({ payload }, { call, put }) {
      const { node, parent } = payload;

      if (!node) {
        yield put({ type: 'addModule' });
        return;
      }

      const res = yield call(services.addProjectFolder, {
        title: node._title,
        parentId: node.parentId
      });

      if (res.success) {
        Object.assign(node, res.data);
        node._creating = false;
        node.title = node._title;

        node.children.forEach(one => {
          one.parentId = node.id;
        });

        yield put({ type: 'freshTree' });
      }
    },

    *updateFolder({ payload }, { call, put }) {
      const { params } = payload;
      const res = yield call(services.updateFolder, params);

      if (res.success) {

      }

      console.log('updateFolder', payload.node);
    },

    *delFolder({ payload }, { call, put }) {
      const { node } = payload;

      if (node._creating) {
        yield put({ type: 'delModule', payload });
        return;
      }
    },

    // ---------------------------------

    *getNode({ payload }, { call, put }) {

    },

    *addNode({ payload }, { call, put }) {
      const { parent, node } = payload;

      if (!node) {
        yield put({ type: 'addHttpDoc', payload: { parent } });
      }
    },

    *updateNode({ payload }, { call, put }) {

    },

    *delNode({ payload }, { call, put }) {
      const { parent, node } = payload;

      if (node._creating) {
        yield put({ type: 'delHttpDoc', payload });
      }
    },

    // ---------------------------------

    *onSelectNode({ payload }, { call, put }) {
      const { node } = payload;

      if (!node || node._loaded) {
        yield put({
          type: 'updateTreeSelectedNode',
          payload: node
        });

        return;
      }

      if (node.type === NODE_TYPE_FOLDER) {
        node._loading = true;
        yield put({ type: 'freshTree' });

        const res = yield call(services.getProjectNodes, { parentId: node.id });
        if (res.success) {
          node.children = res.data.map(one => {
            one.type = NODE_TYPE_HTTPDOC;
            one.key = `${NODE_TYPE_HTTPDOC}_${node.id}`;
            one._loaded = true;
            return one;
          });
        }

        node._loading = false;
        node._loaded = true;

        yield put({
          type: 'updateTreeSelectedNode',
          payload: node
        });
      }
    },

    *extrangeNodes({ payload }, { call, put }) {},

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

    initState() {
      return getDefaultState();
    },

    freshTree(state) {
      return { ...state, tree: { ...state.tree } };
    },

    updateFolders(state, { payload }) {
      const { tree } = state;

      tree.children = payload.map(node => {
        node.type = NODE_TYPE_FOLDER;
        node.key = `${NODE_TYPE_FOLDER}_${node.id}`;
        node.children = [];
        return node;
      });

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

    addModule(state, { payload }) {
      const { tree } = state;

      const node = createNode(tree);
      tree.children.push(node);

      return { ...state, tree: { ...tree } };
    },

    delModule(state, { payload }) {
      const { tree } = state;
      const { node } = payload;

      const index = tree.children.findIndex(one => one.id === node.id);
      tree.children.splice(index, 1);

      return { ...state, tree: { ...tree } };
    },

    addHttpDoc(state, { payload }) {
      const { tree } = state;
      const { parent } = payload;

      const node = createNode(parent);
      parent.children.push(node);

      if (!tree.expandedKeys.includes(parent.key)) {
        tree.expandedKeys = [ ...tree.expandedKeys, parent.key ];
        tree.autoExpandParent = false;
      }

      return { ...state, tree: { ...tree } };
    },

    delHttpDoc(state, { payload }) {
      const { tree } = state;
      const { node, parent } = payload;

      const index = parent.children.findIndex(one => one.id === node.id);
      parent.children.splice(index, 1);

      if (tree.expandedKeys.includes(parent.key)) {
        const index = tree.expandedKeys.findIndex(one => one.key === parent.key);
        tree.expandedKeys.splice(index, 1);
        tree.expandedKeys = [ ...tree.expandedKeys ];
      }

      return { ...state, tree: { ...tree } };
    },

  }
};
