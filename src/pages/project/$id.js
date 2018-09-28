import { Component } from 'react';
import { connect } from 'dva';
import styles from '../../styles/project.less';
import OperationBar  from '../../components/project/OperationBar';
import SideTree  from '../../components/project/SideTree';
import Content  from '../../components/project/Content';

@connect(({ currentProject, loading }) => ({ store: currentProject, loading }))
class Project extends Component {
  onAction = (action) => {
    this.props.dispatch({
      ...action,
      type: `currentProject/${action.type}`
    });
  }

  onSave = () => {}

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
          onAction={this.onAction}
        />
        <Content
          query={query}
          node={tree.selectedNode}
          onAction={this.onAction}
        />
      </div>
    );
  }
}

export default Project;
