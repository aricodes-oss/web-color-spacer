'use client';

import { measurements } from '@/api';
import ColorPicker from '@/components/ColorPicker';
import Counter from '@/components/Counter';
import { hexToRGB } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Plot from 'react-plotly.js';
import styles from '../page.module.scss';

export default function Home() {
  const [lightnessFrom, setLightnessFrom] = useState(0);
  const [lightnessTo, setLightnessTo] = useState(0);

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

  if (query.isLoading) {
    return null;
  }

  const cumulativeLength =
    query.data
      .filter(e => e.start.r === e.start.g && e.start.g === e.start.b)
      .reduce((acc, val) => acc + val.distance / (val.end.r - val.start.r), 0) / query.data.length;

  return (
    <Container>
      <Row>
        <Col>
          <Stack>
            <div
              className={styles.rectangle}
              style={{
                backgroundColor: `rgb(${lightnessFrom}, ${lightnessFrom}, ${lightnessFrom})`,
              }}
            />
            <div
              className={styles.rectangle}
              style={{ backgroundColor: `rgb(${lightnessTo}, ${lightnessTo}, ${lightnessTo})` }}
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
          <Counter value={lightnessFrom} onChange={setLightnessFrom} label="From" />
          <Counter value={lightnessTo} onChange={setLightnessTo} label="To" />
        </Col>
        <Col>
          <Counter value={lightness} onChange={setLightness} label="Compare" />
        </Col>
      </Row>

      <Button
        variant="primary"
        onClick={() =>
          mutation.mutate({
            start: {
              r: lightnessFrom,
              g: lightnessFrom,
              b: lightnessFrom,
            },
            end: {
              r: lightnessTo,
              g: lightnessTo,
              b: lightnessTo,
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

      {cumulativeLength}
    </Container>
  );
}
