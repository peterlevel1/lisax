import styles from './index.css';
import Header from './Header';

export default function BasicLayout(props) {
  const { location } = props;

  return (
    <div className={styles.layoutContainer}>
      {
        !/^\/(project\/\d+|login)$/.test(location.pathname) &&
        <Header location={location} />
      }
      <section className={styles.content}>
        { props.children }
      </section>
    </div>
  );
}
