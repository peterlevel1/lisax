import { Component } from 'react';
import styles from '../../styles/index.less';
import { connect } from 'dva';
import { Table, Button, message } from 'antd';
import { addKey } from '../../utils/common';
import router from 'umi/router';

const columns = addKey([
  { dataIndex: 'name', title: '项目名称' },
  { dataIndex: 'desc', title: '项目描述' },
  { dataIndex: 'createdAt', title: '创建时间' },
  { dataIndex: 'updatedAt', title: '更新时间' },
]);

@connect(({ project, loading }) => ({ store: project, loading }))
class Index extends Component {

  state = {
    selectedRowKeys: []
  }

  onChangeSelectedRowKeys = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  onAdd = () => {
    router.push('/project?type=create');
  }

  onDel = () => {}

  onUpdate = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length !== 1) {
      message.warn('选1个');
      return;
    }

    const key = selectedRowKeys[0];
    const item = this.props.store.data[key];
    router.push(`/project/${item.id}`);
  }

  onLook = () => {}

  render() {
    const { store } = this.props;
    const { selectedRowKeys } = this.state;
    const { data } = store;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <section className={styles.btns}>
            <Button onClick={this.onAdd}>增</Button>
            <Button onClick={this.onDel}>删</Button>
            <Button onClick={this.onUpdate}>改</Button>
            <Button onClick={this.onLook}>看</Button>
          </section>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: this.onChangeSelectedRowKeys
            }}
          />
        </div>
      </div>
    );
  }
}

export default Index;
