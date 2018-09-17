import { Tag } from 'antd';
import styles from './SelectedRecords.less';

export default function SelectedRecords({ data, selectedId, onClickRecord }) {
  return (
    <div className={styles.container}>
      <h3>选择的文档: </h3>
      {
        data.map(item => {
          return (
            <Tag
              color={item.id === selectedId ? 'red' : ''}
              key={item.id}
              onClick={onClickRecord(item)}
            >
              {item.title}
            </Tag>
          )
        })
      }
    </div>
  )
}
