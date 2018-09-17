import { Component } from 'react';
import { connect } from 'dva';
import { document } from 'global';
import styles from '../../styles/project.less';
import OperationBar  from '../../components/project/OperationBar';
import SideTree  from '../../components/project/SideTree';
import Content  from '../../components/project/Content';
import { isIndentType, getUniqueId, walkTree } from '../../utils/common';
import { NODE_TYPE_ROOT, NODE_TYPE_FOLDER, NODE_TYPE_HTTPDOC } from '../../utils/constants';

function createNode(info, parent) {
  const id = `${parent.id}-${parent.children.length}`;
  const ret = {
    inputingTitle: true,
    title: '',
    id,
    type: parent.type === NODE_TYPE_ROOT ? NODE_TYPE_FOLDER : NODE_TYPE_HTTPDOC,
  };

  switch (ret.type) {
    case NODE_TYPE_FOLDER:
      ret.children = [];
    break;

    case NODE_TYPE_HTTPDOC:
      ret.editing = false;
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

function afterDelNode(parent) {
  parent.children.forEach((node, i) => {
    const id = `${parent.id}-${i}`;
    node.id = id;

    if (node.type === NODE_TYPE_HTTPDOC) {
      node.data.id = id.replace(/-/g, '_');
    }
  });
}

@connect(({ currentProject, loading }) => ({ store: currentProject, loading }))
class Project extends Component {

  onChangeTree = () => {
    this.props.dispatch({
      type: 'currentProject/update',
      payload: {
        tree: { ...this.props.store.tree }
      }
    })
  }

  onSave = () => {
    const { store, dispatch } = this.props;
    const content = JSON.stringify(store.tree.children);
    console.log('content', content.length, content);
    console.log('length', store.tree
      .children[0]
        .children[0]
          .data.requestParams[0].name.length);

    dispatch({
      type: 'currentProject/save',
      payload: {
        pathObj: { id: store.data.id },
        params: { content }
      }
    });
  }

  getSelectedNode() {
    return this.props.store.tree.selectedNode;
  }

  getSelectedData() {
    return (this.getSelectedNode() || {}).data;
  }

  onChangeTableItemType = (key) => (value) => {
    if (isIndentType(value)) {
      setTimeout(() => this.onChangeTree(), 200);
    }
  }

  addRequestParam = (key) => {
    const data = this.getSelectedData();
    const item = {
      key: getUniqueId(),
      name: '',
      required: false,
      type: '',
      defaultValue: '',
      desc: '',
      _nameIndent: 0
    };

    if (!key) {
      data.requestParams.push(item);
    } else {
      const index = data.requestParams.findIndex(item => item.key === key);
      const target = data.requestParams[index];
      item._nameIndent = target._nameIndent + 1;

      const start = index;
      const len = data.requestParams.length;
      let end = index;

      while (++end < len) {
        if (data.requestParams[end]._nameIndent < item._nameIndent) {
          break;
        }
      }

      data.requestParams.splice(end, 0, item);
    }

    this.onChangeTree();
  }

  delRequestParam = (key) => {
    const data = this.getSelectedData();
    const index = data.requestParams.findIndex(item => item.key === key);
    const target = data.requestParams[index];

    if (!isIndentType(target.type)) {
      data.requestParams.splice(index, 1);
      this.onChangeTree();
      return;
    }

    const start = index;
    const len = data.requestParams.length;
    let end = start;

    while (++end < len) {
      if (data.requestParams[end]._nameIndent === target._nameIndent) {
        break;
      }
    }

    data.requestParams = [
      ...data.requestParams.slice(0, start),
      ...data.requestParams.slice(end, len),
    ];

    this.onChangeTree();
  }

  clickTitle(item) {
    const tree = this.props.store.tree;

    const selectedNode = tree.selectedNode;
    if (!selectedNode || selectedNode.id === item.id) {
      return;
    }

    const nodeTitle = document.querySelector(`[data-node-id='${item.id}']`);
    if (!nodeTitle) {
      return;
    }

    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, false);
    nodeTitle.dispatchEvent(event);
  }

  onClickRecord = (item) => () => {
    const tree = this.props.store.tree;

    const parentKey = item.id.replace(/-\d+$/, '');
    if (!tree.expandedKeys.includes(parentKey)) {
      tree.expandedKeys = tree.expandedKeys.concat(parentKey);

      this.onChangeTree();
      setTimeout(() => this.clickTitle(item), 200);
      return;
    }

    this.clickTitle(item);
  }

  // 选择侧边栏的树上的doc节点，关联 选择过的记录
  onSelectNode = () => {
    const tree = this.props.store.tree;
    const { selectedNode, selectedRecords } = tree;

    console.log('selectedNode', selectedNode);
    const found = selectedRecords.find(one => one.id === selectedNode.id);
    if (!found) {
      selectedRecords.push(selectedNode);
    }

    // update content
    //   1. selected recored
    //   2. form data
    // this.setState({ selectedRecords: [ ...selectedRecords ] });
    this.onChangeTree();
  }

  render() {
    const { store, location } = this.props;
    const { tree, data } = store;
    const { query } = location;

    return (
      <div className={styles.container}>
        <OperationBar onSave={this.onSave} />
        <SideTree
          query={query}
          tree={tree}
          createNode={createNode}
          onSelectNode={this.onSelectNode}
          onChangeTree={this.onChangeTree}
          afterDelNode={afterDelNode}
        />
        <Content
          query={query}
          onClickRecord={this.onClickRecord}
          node={tree.selectedNode}
          selectedRecords={tree.selectedRecords}
          addRequestParam={this.addRequestParam}
          delRequestParam={this.delRequestParam}
          getNameIndent={this.getNameIndent}
          onChangeTableItemType={this.onChangeTableItemType}
        />
      </div>
    );
  }
}

export default Project;
