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
  const [r1, setR1] = useState(0);
  const [g1, setG1] = useState(0);
  const [b1, setB1] = useState(0);
  const [r2, setR2] = useState(0);
  const [g2, setG2] = useState(0);
  const [b2, setB2] = useState(0);
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

  const countersL = [
    [r1, setR1],
    [g1, setG1],
    [b1, setB1],
    [r2, setR2],
    [g2, setG2],
    [b2, setB2],
  ];
  const countersR = [
    [lightness, setLightness, 'Lightness'],
  ]

  return (
    <Container>
      <Row>
        <Col>
          <Stack>
            <div
              className={styles.rectangle}
              style={{ backgroundColor: `rgb(${r1}, ${g1}, ${b1})` }}
            />
            <div
              className={styles.rectangle}
              style={{ backgroundColor: `rgb(${r2}, ${g2}, ${b2})` }}
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
        <Col>
          {countersL.map(([value, onChange, label], idx) => (
            <Counter key={idx} value={value} onChange={onChange} label={label} />
          ))}
        </Col>
        <Col>
          {countersR.map(([value, onChange, label], idx) => (
            <Counter key={idx} value={value} onChange={onChange} label={label} />
          ))}
        </Col>
      </Row>

      <Button
        variant="primary"
        onClick={() =>
          mutation.mutate({
            start: {
              r: r1,
              g: g1,
              b: b1,
            },
            end: {
              r: r2,
              g: g2,
              b: b2,
            },

            distance: lightness,
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

function cumulativeLength(query, lightness) {
  let accumulator = 0
  if (query.isSuccess) {
    query.data.forEach(element => {
      if (element.start.r == element.start.g && element.start.g == element.start.b && element.end.r == element.end.g && element.end.g == element.end.b) {
        accumulator += element.distance / (element.end.r - element.start.r)
      }
    });
    accumulator /= query.data.length
  }
  return accumulator * lightness // will return 0 when the query fails. that might not be what we want.
}