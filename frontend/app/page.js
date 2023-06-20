'use client';

import Counter from './counter';
import styles from './page.module.scss';
import { measurements } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import classNames from 'classnames';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Plot from 'react-plotly.js';

const DELTA = 25;
const QUERY_KEY = ['measurements'];

export default function Home() {
  const [l2, setL2] = useState(0);
  const [lightness, setLightness] = useState(0); // l for lightness
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: measurements.all,
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

      distance: lightness / DELTA, // if l is half of d, for example, then the scale factor is 1/2, i.e. the measured pair is half as distinct as black to d,d,d
    });

    console.log(res);
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const counters = [
    [l2, setL2],
    [lightness, setLightness, 'Lightness'],
  ];

  return (
    <Container>
      <Row>
        <Col>
          <Stack>
            <div
              className={styles.rectangle}
              style={{ backgroundColor: `rgb(${l2}, ${l2}, ${l2})` }}
            />
            <div
              className={styles.rectangle}
              style={{ backgroundColor: `rgb(${ld}, ${ld}, ${ld})` }}
            />
          </Stack>
        </Col>

        <Col>
          <Stack>
            <div className={classNames(styles.rectangle, styles.black)} />
            <div
              className={styles.rectangle}
              style={{ backgroundColor: `rgb(${lightness}, ${lightness}, ${lightness})` }}
            />
          </Stack>
        </Col>
      </Row>

      <Row>
        {counters.map(([value, onChange, label], idx) => (
          <Col key={idx}>
            <Counter value={value} onChange={onChange} label={label} />
          </Col>
        ))}
      </Row>

      <Button variant="primary" onClick={onSubmit}>
        Submit
      </Button>

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
    </Container>
  );
}
