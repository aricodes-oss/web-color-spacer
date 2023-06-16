'use client';

import Counter from './counter';
import styles from './page.module.scss';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import classNames from 'classnames';
import { useState } from 'react';
import Plot from 'react-plotly.js';

const DELTA = 25;
const QUERY_KEY = ['measurements'];

export default function Home() {
  const [l2, setL2] = useState(0);
  const [l, setL] = useState(0); // l for lightness
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get('/v1/measurements/');
      return data;
    },
  });

  const ld = l2 + DELTA;

  const onSubmit = async () => {
    const res = await axios.post('/v1/measurements/', {
      start: {
        r: l2,
        g: l2,
        b: l2,
      }, // l2 tends to get updated to 0 before this is run?
      end: {
        r: ld,
        g: ld,
        b: ld,
      },

      distance: l / DELTA, // if l is half of d, for example, then the scale factor is 1/2, i.e. the measured pair is half as distinct as black to d,d,d
    });

    console.log(res);
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
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

      {query.isSuccess && (
        <Plot
          data={[
            {
              x: query.data.map(e => e.start.r),
              y: query.data.map(e => e.distance),
              type: 'scatter',
              mode: 'markers',
            },
          ]}
          layout={{ width: 320, height: 240 }}
        />
      )}
    </main>
  );
}
