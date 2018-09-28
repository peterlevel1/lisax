import styles from './Content.less';
import HttpDoc from './HttpDoc';
import SelectedRecords from './SelectedRecords';
import { Tooltip, Button } from 'antd';
import { NODE_TYPE_ROOT, NODE_TYPE_FOLDER, NODE_TYPE_HTTPDOC } from '../../utils/constants';

export default function Content(props) {
  return (
    <div className={styles.container}>
      {renderNode(props)}
    </div>
  )
}

// {/* TODO: 当删除某节点后，观察渲染数据情况的变化 */}
// <HttpDoc {...props} key={_node.id} data={_node.data} />
// <SelectedRecords onClickRecord={onClickRecord} data={selectedRecords} selectedId={_node.id} />
// addRequestParam, delRequestParam, getNameIndent, onChangeTableItemType

function renderNode({ node, ...props }) {
  if (!node) {
    return null;
  }

  if (node.type === NODE_TYPE_HTTPDOC) {
    return <HttpDoc {...props} data={node.data} key={node.key} />;
  }

  return null;
}
