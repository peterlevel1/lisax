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

function createNode(parent, node = {}) {
  const type = parent.type === NODE_TYPE_ROOT ? NODE_TYPE_FOLDER : NODE_TYPE_HTTPDOC;
  const id = node.id ? node.id + '' : `${parent.id}-${parent.children.length}`;
  const key = `${type}_${id}`;
  const ret = {
    // ---------------------
    // id，创建之前，由前端创造id, 创建之后，更新为返回数据的id
    id,
    // parentId 与后台保持同步
    parentId: parent.id,
    title: node.title || '',
    desc: node.desc || '',
    // ---------------------
    type,
    key,

    _loaded: false,
    _loading: false,
    _inputingTitle: true,
    _title: '',
    // ---------------------
  };

  switch (ret.type) {
    case NODE_TYPE_FOLDER:
      ret.children = node.children || [];
    break;

    case NODE_TYPE_HTTPDOC:
      ret.data = node.data || {
        request: {
          method: 'GET',
          url: '',
          // TODO: 保存时要把 desc 数据 拿出来放到 node 节点上
          desc: node.desc || '',
          params: []
        },

        response: {
          params: []
        }
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
          payload: { parentId: res.data.id }
        })
      }
    },

    *getFolders({ payload }, { call, put }) {
      const res = yield call(services.getProjectFolders, payload);
      if (res.success) {
        yield put({
          type: 'updateLoadedFolders',
          payload: res.data
        });
      }
    },

    // ---------------------------------

    *addFolder({ payload }, { call, put }) {
      const { node, parent } = payload;

      if (!node) {
        yield put({ type: 'addModule', payload });
        return;
      }

      node._loading = true;
      yield put({ type: 'freshTree' });

      const res = yield call(services.addProjectFolder, {
        title: node._title,
        parentId: node.parentId
      });

      if (res.success) {
        node.id = res.data.id + '';
        node._loading = false;
        node._loaded = true;
        node.title = node._title;

        node.children.forEach(one => {
          one.parentId = node.id;
        });

        yield put({ type: 'freshTree' });
      }
    },

    *updateFolder({ payload }, { call, put }) {
      const { node, parent } = payload;

      if (!node._loaded) {
        return;
      }

      if (node._inputingTitle) {
        yield put({ type: 'updateModule', payload });
        return;
      }

      const { _title, id, desc } = node;
      const res = yield call(services.updateProjectFolder, { title: _title, desc }, { id });
      if (res.success) {
        node.title = node._title;
        yield put({ type: 'updateModule', payload });
      }
    },

    *delFolder({ payload }, { call, put }) {
      const { node, parent } = payload;

      if (!node._loaded) {
        yield put({ type: 'delModule', payload });
        return;
      }

      const { id } = node;
      const res = yield call(services.delFolder, null, { id });
      if (res.success) {
        yield put({ type: 'delModule', payload });
      }
    },

    // ---------------------------------

    *addNode({ payload }, { call, put }) {
      const { node, parent } = payload;

      if (!node) {
        yield put({ type: 'addHttpDoc', payload });
        return;
      }

      node._loading = true;
      yield put({ type: 'freshTree' });

      const res = yield call(services.addProjectNode, {
        title: node._title,
        parentId: node.parentId
      });

      if (res.success) {
        node.id = res.data.id + '';
        node._loading = false;
        node._loaded = true;
        node.title = node._title;

        yield put({ type: 'freshTree' });
      }
    },

    *updateNode({ payload }, { call, put }) {
      const { node, parent, src } = payload;

      if (!node._loaded) {
        return;
      }

      if (node._inputingTitle) {
        yield put({ type: 'updateHttpDoc', payload });
        return;
      }

      const { _title, id, desc, data } = node;
      const params = { title: _title, desc };
      if (data) {
        params.data = JSON.stringify(data);
      }

      const res = yield call(services.updateProjectNode, params, { id });
      if (res.success) {
        node.title = node._title;
        yield put({ type: 'updateHttpDoc', payload });
      }
    },

    *delNode({ payload }, { call, put }) {
      const { node, parent } = payload;
      const { id } = node;
      const res = yield call(services.delProjectNode, null, { id });
      if (res.success) {
        yield put({ type: 'delHttpDoc', payload });
      }
    },

    // ---------------------------------

    *onSelectNode({ payload }, { call, put }) {
      const { node } = payload;

      if (!node || node._loaded) {
        yield put({
          type: 'updateSelectedNode',
          payload: node
        });

        return;
      }

      if (node.type === NODE_TYPE_FOLDER) {
        node._loading = true;
        yield put({ type: 'freshTree' });

        const res = yield call(services.getProjectNodes, { parentId: node.id });
        if (res.success) {
          node._loading = false;
          node._loaded = true;

          node.children = res.data.map(one => {
            if (one.data) {
              one.data = JSON.parse(one.data);
            }

            return {
              ...createNode(node, one),
              _inputingTitle: false,
              _loaded: true,
            };
          });
        }

        yield put({
          type: 'updateSelectedNode',
          payload: node
        });
      }
    },
  },

  reducers: {
    update: reducerSave,

    initState() {
      return getDefaultState();
    },

    freshTree(state) {
      return { ...state, tree: { ...state.tree } };
    },

    updateLoadedFolders(state, { payload }) {
      const { tree } = state;

      tree.children = payload.map(one => {
        return {
          ...createNode(tree),
          ...one,
          key: `${NODE_TYPE_FOLDER}_${one.id}`,
          _inputingTitle: false,
        };
      });

      return { ...state, tree: { ...tree } };
    },

    updateSelectedNode(state, { payload }) {
      const tree = state.tree;
      const node = payload;

      if (node && node.type === NODE_TYPE_FOLDER) {
        tree.expandedKeys = [ node.key ];
      }

      tree.selectedNode = node;

      return { ...state, tree: { ...tree } };
    },

    // ---------------------------------

    addModule(state, { payload }) {
      const { tree } = state;
      const { parent } = payload;

      const node = createNode(parent);
      parent.children.push(node);

      return { ...state, tree: { ...tree } };
    },

    updateModule(state, { payload }) {
      return { ...state, tree: { ...state.tree } };
    },

    delModule(state, { payload }) {
      const { tree } = state;
      const { node } = payload;

      const index = tree.children.findIndex(one => one.id === node.id);
      tree.children.splice(index, 1);

      if (tree.expandedKeys.includes(node.key)) {
        const index = tree.expandedKeys.findIndex(one => one.key === node.key);
        tree.expandedKeys.splice(index, 1);
        tree.expandedKeys = [ ...tree.expandedKeys ];
      }

      return { ...state, tree: { ...tree } };
    },

    // ---------------------------------

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

    updateHttpDoc(state, { payload }) {
      return { ...state, tree: { ...state.tree } };
    },

    delHttpDoc(state, { payload }) {
      const { tree } = state;
      const { node, parent } = payload;

      const index = parent.children.findIndex(one => one.id === node.id);
      parent.children.splice(index, 1);

      if (!parent.children.length && tree.expandedKeys.includes(parent.key)) {
        const index = tree.expandedKeys.findIndex(one => one.key === parent.key);
        tree.expandedKeys.splice(index, 1);
        tree.expandedKeys = [ ...tree.expandedKeys ];
      }

      return { ...state, tree: { ...tree } };
    },

  }
};
