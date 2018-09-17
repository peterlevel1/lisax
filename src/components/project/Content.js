import styles from './Content.less';
import HttpDoc from './HttpDoc';
import SelectedRecords from './SelectedRecords';
import { Tooltip, Button } from 'antd';

export default function Content(props) {
  const { selectedRecords, node, onClickRecord, onSave } = props;
  const _node = node || {};

  return (
    <div className={styles.container}>
    </div>
  )
}
// {/* TODO: 当删除某节点后，观察渲染数据情况的变化 */}
// <HttpDoc {...props} key={_node.id} data={_node.data} />
// <SelectedRecords onClickRecord={onClickRecord} data={selectedRecords} selectedId={_node.id} />

