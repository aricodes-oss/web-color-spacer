'use client';

import Counter from './counter';
import styles from './page.module.scss';
import { measurements } from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Plot from 'react-plotly.js';

const DELTA = 25;

export default function Home() {
  const [l2, setL2] = useState(0);
  const [lightness, setLightness] = useState(0);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: measurements.queryKey,
    queryFn: measurements.all,
  });
  const mutation = useMutation({
    mutationFn: measurements.create,
    onSuccess: () => {
      queryClient.invalidateQueries(measurements.queryKey);
    },
  });

  const ld = l2 + DELTA;

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

      <Button
        variant="primary"
        onClick={() =>
          mutation.mutate({
            start: {
              r: l2,
              g: l2,
              b: l2,
            },
            end: {
              r: ld,
              g: ld,
              b: ld,
            },

            // if l is half of d, for example, then the scale factor is 1/2, i.e. the measured pair is half as distinct as black to d,d,d
            distance: lightness / DELTA,
          })
        }
      >
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
