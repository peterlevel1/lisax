import { Component } from 'react';
import styles from './OperationBar.less';
import { Icon, Menu, Button } from 'antd';
import router from 'umi/router';

export default class OperationBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      selectedKeys: []
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  onClickMenu = ({ key, keyPath }) => {
    switch (key) {
      case 'home':
        router.push('/');
      break;
      case 'project':
        router.push('/project');
      break;
      case 'save':
        this.props.onSave();
      break;
    }
  }

  render() {
    const { collapsed, selectedKeys } = this.state;

    return (
      <div className={styles.container}>
        <header>
          <Button type="primary" onClick={this.toggleCollapsed}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </Button>
        </header>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={selectedKeys}
          inlineCollapsed={collapsed}
          onClick={this.onClickMenu}
        >
          <Menu.Item key="home">
            <Icon type='home' />
            <span>首页</span>
          </Menu.Item>
          <Menu.Item key="project">
            <Icon type='ordered-list' />
            <span>项目列表</span>
          </Menu.Item>
          <Menu.Item key="save">
            <Icon type='save' />
            <span>保存</span>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

// ({ onSave }) {
// }
// <Link to='/' title='首页'><Icon type='home' /></Link>
// <Link to='/project' title=''><Icon type='' /></Link>
// <a title='保存' onClick={onSave}><Icon type='save' /></a>