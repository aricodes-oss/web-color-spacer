'use client';

import Counter from './counter';
import styles from './page.module.scss';
import axios from 'axios';
import classNames from 'classnames';
import { useState } from 'react';

export default function Home() {
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);

  const onSubmit = async () => {
    const res = await axios.post('/v1/measurements/', {
      start: { r, g, b },
      end: {
        r: 255,
        g: 255,
        b: 255,
      },

      distance: 127,
    });

    console.log(res);
  };

  const counters = [
    [r, setR],
    [g, setG],
    [b, setB],
  ];

  return (
    <main className={styles.main}>
      <div className={styles.row}>
        <div className={classNames(styles.rectangle, styles.blue)} />
        <div className={classNames(styles.rectangle, styles.red)} />
        <div className={styles.rectangle} style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }} />
      </div>

      {counters.map(([value, onChange], idx) => (
        <Counter value={value} onChange={onChange} key={idx} />
      ))}

      <button onClick={onSubmit}>Submit</button>
    </main>
  );
}
