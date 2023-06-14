'use client';

import Counter from './counter';
import styles from './page.module.scss';
import axios from 'axios';
import classNames from 'classnames';
import { useState } from 'react';

export default function Home() {
  const [l2, setL2] = useState(0);
  const [l, setL] = useState(0); // l for lightness

  let delta = 25
  let ld = l2 + delta

  const onSubmit = async () => {
    const res = await axios.post('/v1/measurements/', {
      start: { l2, l2, l2 },
      end: {
        r: ld,
        g: ld,
        b: ld,
      },

      distance: l / delta, // if l is half of d, for example, then the scale factor is 1/2, i.e. the measured pair is half as distinct as black to d,d,d
    });

    console.log(res);
  };

  const counters = [
    [l2, setL2],
    [l, setL],
  ];

  return (
    <main className={styles.main}>
      <div className={styles.row}>
        <div className={styles.rectangle} style={{ backgroundColor: `rgb(${l2}, ${l2}, ${l2})` }} />
        <div className={styles.rectangle} style={{ backgroundColor: `rgb(${ld}, ${ld}, ${ld})` }} />
      </div>
      <div className={styles.row}>
        <div className={classNames(styles.rectangle, styles.black)} />
        <div className={styles.rectangle} style={{ backgroundColor: `rgb(${l}, ${l}, ${l})` }} />
      </div>

      {counters.map(([value, onChange], idx) => (
        <Counter value={value} onChange={onChange} key={idx} />
      ))}

      <button onClick={onSubmit}>Submit</button>
    </main>
  );
}
