'use client';

import ColorPicker from './colorpicker';
import Counter from './counter';
import styles from './page.module.scss';
import { measurements } from '@/api';
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

export default function Home() {
  const [colorFrom, setColorFrom] = useState('#000000');
  const [colorTo, setColorTo] = useState('#000000');

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

  const countersR = [[lightness, setLightness, 'Lightness']];

  return (
    <Container>
      <Row>
        <Col>
          <Stack>
            <div className={styles.rectangle} style={{ backgroundColor: colorFrom }} />
            <div className={styles.rectangle} style={{ backgroundColor: colorTo }} />
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
          <ColorPicker value={colorFrom} onChange={setColorFrom} label="From" />
          <ColorPicker value={colorTo} onChange={setColorTo} label="To" />
        </Col>
        <Col>
          <Counter value={lightness} onChange={setLightness} label="Compare" />
        </Col>
      </Row>

      <Button
        variant="primary"
        onClick={() =>
          mutation.mutate({
            start: hexToRGB(colorFrom),
            end: hexToRGB(colorTo),

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
  let accumulator = 0;
  if (query.isSuccess) {
    query.data.forEach(element => {
      if (
        element.start.r == element.start.g &&
        element.start.g == element.start.b &&
        element.end.r == element.end.g &&
        element.end.g == element.end.b
      ) {
        accumulator += element.distance / (element.end.r - element.start.r);
      }
    });
    accumulator /= query.data.length;
  }
  return accumulator * lightness; // will return 0 when the query fails. that might not be what we want.
}
