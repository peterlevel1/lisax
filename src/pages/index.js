import { Component } from 'react';
import styles from '../styles/index.less';
import { connect } from 'dva';

@connect(({ app, loading }) => ({ store: app, loading }))
class Index extends Component {
  render() {
    return (
      <div className={styles.container}>
        <h1>apx</h1>
      </div>
    );
  }
}

export default Index;
