import { Component } from 'react';
import styles from './SideTree.less';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { Input, Button, Icon, Select, Tree } from 'antd';
import { document } from 'global';
import { walkTree, findIndex } from '../../utils/common';
import { NODE_TYPE_FOLDER, NODE_TYPE_HTTPDOC } from '../../utils/constants';
import Contextmenu from './SideTree/Contextmenu';

const TreeNode = Tree.TreeNode;

const CONTEXTMENU_ID = 'siderTree_contextmenu';
const CONTEXTMENU_MENUS_MAP = {
  [NODE_TYPE_FOLDER]: [
    { text: '新增文档', type: 'addHttpDoc' },
    { text: '编辑', type: 'editFolder' },
    { text: '删除', type: 'delFolder' },
  ],

  [NODE_TYPE_HTTPDOC]: [
    { text: '编辑', type: 'editHttpDoc' },
    { text: '删除', type: 'delHttpDoc' },
  ]
};
const NODE_ICON_TYPES = {
  [NODE_TYPE_FOLDER]: 'folder',
  [NODE_TYPE_HTTPDOC]: 'book',
};

export default class SideTree extends Component {
  static propTypes = {
    tree: PropTypes.object,
    onChangeTree: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tree: null
  }

  constructor(props) {
    super(props);

    this.state = {
      contextmenu: {
        active: false,
        node: null,
        x: 0,
        y: 0,
      },
    };

    this.lazyLoadFolders = [];
  }

  componentDidMount() {
    document.body.addEventListener('click', this.hideContextmenuIfPossible);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.hideContextmenuIfPossible);
  }

  getNodeByKey(key) {
    const node = walkTree(this.props.tree.children, (node) => {
      if (node.key === key) {
        return node;
      }
    });

    invariant(node, `[sideTree.getNode] key: ${key}, node should be found`);

    return node;
  }

  hideContextmenuIfPossible = (e) => {
    if (!this.state.contextmenu.active) {
      return;
    }

    let path = e.path;
    if (!path) {
      path = [];

      let parent = e.target;
      while (parent) {
        path.push(parent);
        parent = parent.parentNode;
      }
    }

    let id;
    for (let i = 0, ii = path.length; i < ii; i++) {
      id = path[i].id;
      if (!id) {
        continue;
      }

      if (id === CONTEXTMENU_ID) {
        return;
      }

      if (id === 'root') {
        this.setState({
          contextmenu: { ...this.state.contextmenu, active: false }
        });
        return;
      }
    }
  }

  // 顶部+ 加文件夹
  // 文件夹+ 加文档
  onAdd = (info) => {
    const tree = this.props.tree;
    const parent = this.getNodeById(info.id);
    const node = this.props.createNode(info, parent);

    parent.children.push(node);

    if (parent.type === NODE_TYPE_FOLDER) {
      if (!tree.expandedKeys.includes(parent.id)) {
        tree.expandedKeys = [ ...tree.expandedKeys, parent.id ];
      }

      tree.autoExpandParent = false;
    }

    this.props.onChangeTree();
  }

  onExpand = (expandedKeys) => {
    const tree = this.props.tree;
    tree.expandedKeys = expandedKeys;
    tree.autoExpandParent = false;

    this.props.onChangeTree();
  }

  onSelect = (selectedKeys) => {
    if (!selectedKeys.length) {
      this.props.onAction({
        type: 'onSelectNode',
        payload: { node: null }
      });
      return;
    }

    const key = selectedKeys[selectedKeys.length - 1];
    const node = this.getNodeByKey(key);

    this.props.onAction({
      type: 'onSelectNode',
      payload: { node }
    });
  }

  onRightClick = (e) => {
    const { event, node } = e;
    event.persist();

    const selectedNode = this.getNodeById(node.props.eventKey);

    this.setState({
      contextmenu: {
        ...this.state.contextmenu,
        active: true,
        node: selectedNode,
        x: event.pageX,
        y: event.pageY,
      }
    });
  }

  onChangeTitleInput = (node) => (e) => {
    this.handleTitleInput(node, e);
  }

  onBlurTitleInput = (node) => (e) => {
    this.handleTitleInput(node, e, true);
  }

  onPressEnterTitleInput = (node) => (e) => {
    this.handleTitleInput(node, e, true);
  }

  handleTitleInput(node, e, done) {
    node.title = e.target.value;
    if (done) {
      node.inputingTitle = false;

      if (!node.title) {
        this.handleTreeAction({
          actionType: node.type === NODE_TYPE_FOLDER ? 'delFolder' : 'delHttpDoc',
          node
        });
        return;
      }
    }

    this.props.onChangeTree();
  }

  onClickMenu = (menuItem) => () => {
    this.handleTreeAction({ actionType: menuItem.type, node: this.state.contextmenu.node });
  }

  handleTreeAction({ actionType, node }) {
    const tree = this.props.tree;
    const contextmenu = this.state.contextmenu;

    if (contextmenu.active) {
      this.setState({
        contextmenu: { ...contextmenu, active: false }
      });
    }

    if (actionType === 'addHttpDoc') {
      this.onAdd({ from: 'folder', id: node.id });
      return;
    }

    switch (actionType) {
      case 'editFolder':
      case 'editHttpDoc':
        node.inputingTitle = true;
      break;
      case 'delFolder':
      case 'delHttpDoc': {
        const parentId = node.id.replace(/-\d+$/, '');
        const parent = this.getNodeById(parentId);
        const index = findIndex(parent.children, (one) => one.id === node.id);
        parent.children.splice(index, 1);

        if (actionType === 'delHttpDoc') {
          // 1. selectedRecords
          const recordIndex = tree.selectedRecords.findIndex(item => item.id === node.id);
          if (recordIndex > -1) {
            tree.selectedRecords.splice(recordIndex, 1);
          }

          // 2. selectedNode
          if (tree.selectedNode) {
            if (tree.selectedNode.id === node.id) {
              tree.selectedNode = null;
            }
          }
        }

        if (actionType === 'delFolder') {
          // 1. selectedRecords
          node.children.forEach(node => {
            const index = tree.selectedRecords.findIndex(one => one === node);
            if (index > -1) {
              tree.selectedRecords.splice(index, 1);
            }

            // 2. selectedNode
            if (tree.selectedNode === node) {
              tree.selectedNode = null;
            }
          });

          // 3. expandedKeys
          if (tree.expandedKeys.includes(node.id)) {
            const index = findIndex(tree.expandedKeys, (key) => key === node.id);
            tree.expandedKeys.splice(index, 1);
          }
        }

        this.props.afterDelNode(parent);
      }
      break;
    }

    this.props.onChangeTree();
  }

  renderTree(data) {
    const arr = data || this.props.tree.children;
    if (!arr || !arr.length) {
      return null;
    }

    return arr.map((node, i) => {
      const title = this.renderTitle(node);

      if (node.children && node.children.length) {
        return (
          <TreeNode key={node.key} title={title}>
            {this.renderTree(node.children)}
          </TreeNode>
        );
      }

      return <TreeNode key={node.key} title={title} />;
    });
  }

  renderTitle(node) {
    if (node.inputingTitle) {
      return (
        <Input
          className={styles.inputingTitle}
          autoFocus
          style={{ width: 80 }}
          value={node.title}
          onChange={this.onChangeTitleInput(node)}
          onBlur={this.onBlurTitleInput(node)}
          onPressEnter={this.onPressEnterTitleInput(node)}
        />
      );
    }

    return (
      <span className={styles.treeNodeTitle} data-node-type={node.type} data-node-id={node.id}>
        <span>
          {node.loading && <Icon type={'loading'} />}
          <Icon type={NODE_ICON_TYPES[node.type]} />
          {node.title}
        </span>
      </span>
    );
  }

  render() {
    const contextmenu = this.state.contextmenu;
    const tree = this.props.tree;
    console.log('tree.expandedKeys', tree.expandedKeys);

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Button onClick={() => this.onAdd({ from: 'root', id: tree.id })}>
            <Icon type='plus' />
          </Button>
        </header>
        <div className={styles.content}>
          {
            tree &&
            <Tree
              expandedKeys={tree.expandedKeys}
              autoExpandParent={tree.autoExpandParent}
              onExpand={this.onExpand}
              onRightClick={this.onRightClick}
              onSelect={this.onSelect}
            >
              {this.renderTree()}
            </Tree>
          }
        </div>
        <Contextmenu
          {...contextmenu}
          id={CONTEXTMENU_ID}
          menus={CONTEXTMENU_MENUS_MAP}
          onClick={this.onClickMenu}
        />
      </div>
    );
  }
}
