'use client';

import styles from './page.module.scss';
import classNames from 'classnames';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.row}>
        <div className={classNames(styles.rectangle, styles.blue)} />
        <div className={classNames(styles.rectangle, styles.red)} />
        <div className={styles.rectangle} style={{ backgroundColor: 'rgb(0, 255, 0)' }} />
      </div>

      <button onClick={() => alert('You did it!')}>Press me!</button>
    </main>
  );
}
