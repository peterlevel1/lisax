import styles from './Contextmenu.less';
import classnames from 'classnames';

export default function Contextmenu({ active, node, x, y, onClick, id, menus }) {
  const cls = classnames({
    [styles.contextmenu]: true,
    [styles.active]: active
  });

  if (!active) {
    return <ul className={cls} />;
  }

  return (
    <ul className={cls} id={id} style={{ left: x + 5, top: y + 5 }}>
      {
        menus[node.type].map((item, i) => (
          <li key={i} onClick={onClick(item)}>{item.text}</li>
        ))
      }
    </ul>
  );
}
