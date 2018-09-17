import { Component } from 'react';
import styles from './SideTree.less';
import { Input, Button, Icon, Select, Tree } from 'antd';

const TreeNode = Tree.TreeNode;
const NODE_TYPE_FOLDER = '1';
const NODE_TYPE_HTTPDOC = '2';
const NODE_TYPE_MAP = {
  [NODE_TYPE_FOLDER]: '文件夹',
  [NODE_TYPE_HTTPDOC]: 'http文档'
};

export default class SideTree extends Component {

  static renderTitle(item) {
    const map = {
      '1': 'folder',
      '2': 'book'
    };

    return <span><Icon type={map[item.type]} /> {item.title}</span>;
  }

  static walk(arr = [], cb) {
    let ret;

    for (let i = 0, ii = arr.length; i < ii; i++) {
      ret = cb(arr[i]);
      if (ret === false) {
        return false;
      }

      if (arr[i].children) {
        ret = this.walk(arr[i].children, cb);
        if (ret === false) {
          return false;
        }
      }
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      expandedKeys: [],
      selectedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      data: [],
      rootNode: {
        id: '0',
        title: 'lllaa',
        type: NODE_TYPE_FOLDER
      },
    };
  }

  onAdd = ({ name, type }) => {
    const { selectedKeys, data, rootNode } = this.state;
    let id;

    if (!selectedKeys.length) {
      id = `${rootNode.id}-${data.length}`;
      data.push({ id, title: name, type });
    } else {
      const selectedKey = selectedKeys[0];
      let node;
      SideTree.walk(this.state.data, (one) => {
        if (one.id === selectedKey) {
          node = one;
          return false;
        }
      });

      node.children = node.children || [];
      id = `${node.id}-${node.children.length}`;
      node.children.push({ id, title: name, type });
    }

    this.setState({ data: [ ...data ] });
  }

  // onUpdate = ({ name, type }) => {}
  // onDel = (id) => {}

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onSelect = (selectedKeys, info) => {
    // console.log('selected', selectedKeys, info);
    this.setState({ selectedKeys });
  }

  onRightClick = ({ event, node }) => {
    // key: node.props.eventKey -> 0-0-0
    console.log('onRightClick', event.target.pageX, node);
  }

  renderTree(data) {
    const arr = data || this.state.data;
    // const parentNode = parent || this.state.rootNode;

    if (!arr.length) {
      return null;
    }

    return arr.map((item, i) => {
      const title = SideTree.renderTitle(item);

      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.id} title={title}>
            {this.renderTree(item.children, item)}
          </TreeNode>
        );
      }

      return <TreeNode key={item.id} title={title} />;
    });
  }

  render() {
    const { expandedKeys, autoExpandParent } = this.state;

    return (
      <div className={styles.container}>
        <Header onAdd={this.onAdd} />
        <div className={styles.content}>
          <Tree
            onExpand={this.onExpand}
            onRightClick={this.onRightClick}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onSelect={this.onSelect}
          >
            {this.renderTree()}
          </Tree>
        </div>
      </div>
    );
  }
}

class Header extends Component {
  state = {
    name: '',
    type: NODE_TYPE_FOLDER
  };

  onChangeName = (e) => {
    this.setState({ name: e.target.value });
  }

  onChangeType = (value) => {
    this.setState({ type: value });
  }

  onAdd = () => {
    const { onAdd } = this.props;
    const { name, type } = this.state;

    onAdd({ name, type });
  }

  render() {
    const { name, type } = this.state;

    return (
      <header>
        <Input value={name} onChange={this.onChangeName} />
        <Select value={type} onChange={this.onChangeType}>
          {
            Object.keys(NODE_TYPE_MAP).map(key => (
              <Select.Option key={key} value={key}>{NODE_TYPE_MAP[key]}</Select.Option>
            ))
          }
        </Select>
        <Button onClick={this.onAdd}><Icon type='plus' /></Button>
      </header>
    );
  }
}
