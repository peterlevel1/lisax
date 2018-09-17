import { Component } from 'react';
import styles from './Header.less';
import { Menu, Button } from 'antd';
import router from 'umi/router';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMenuKey: props.location.pathname,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.state.currentMenuKey) {
      this.setState({ currentMenuKey: nextProps.location.pathname });
    }
  }

  onClickMenu = (e) => {
    if (e.key.startsWith('/')) {
      this.setState({ currentMenuKey: e.key }, () => {
        router.push(`${e.key}`);
      });
      return;
    }

    this.setState({ currentMenuKey: e.key });
  }

  render() {
    const { currentMenuKey } = this.state;
    const { location } = this.props;

    return (
      <header className={styles.layoutHeader}>
        <Menu
          mode='horizontal'
          theme='light'
          onClick={this.onClickMenu}
          selectedKeys={[ currentMenuKey ]}
        >
          <Menu.Item key='/'>主页</Menu.Item>
          <Menu.Item key="/project">项目</Menu.Item>
        </Menu>
      </header>
    );
  }
}
