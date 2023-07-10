'use client';

import { measurements } from '@/api';
import ColorSample from '@/components/ColorSample';
import { hexToRGB, gradientColors } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const Gradient = dynamic(() => import('../components/Gradient'), { ssr: false });

export default function Home() {
  const [colorFrom, setColorFrom] = useState('#000000');
  const [colorTo, setColorTo] = useState('#000000');
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

  // Hide the UI until we've loaded our data
  if (query.isLoading) {
    return null;
  }

  const grays = query.data.filter(e => e.start.gray && e.end.gray);

  const cumulativeLength =
    grays.reduce((acc, val) => acc + val.distance / (val.end.r - val.start.r), 0) / grays.length;

  // Default: coefficients equal 1 as in unscaled euclidean distance
  // Note: these coefficients are actually the squares of the scale factors
  let coeffRed = 1;
  let coeffGreen = 1;
  let coeffBlue = 1;

  // Reusable portion of the partial derivative of squared error
  const oneMinusLengthRatio = val =>
    1 -
    (val.distance * cumulativeLength) /
      Math.sqrt(
        coeffRed * (val.end.r - val.start.r) ** 2 +
          coeffGreen * (val.end.g - val.start.g) ** 2 +
          coeffBlue * (val.end.b - val.start.b) ** 2,
      );

  const coeffReducer = key => (acc, val) =>
    acc + (val.end[key] - val.start[key]) ** 2 * oneMinusLengthRatio(val);

  // TODO: Name this better
  const learningRate = 0.0000001;

  // Gradient descent
  for (let i = 0; i < 1000; i++) {
    coeffRed -= learningRate * query.data.reduce(coeffReducer('r'), 0);
    coeffGreen -= learningRate * query.data.reduce(coeffReducer('g'), 0);
    coeffBlue -= learningRate * query.data.reduce(coeffReducer('b'), 0);
  }

  const onSubmit = lightness =>
    mutation.mutate({
      start: hexToRGB(colorFrom),
      end: hexToRGB(colorTo),
      distance: lightness,
    });

  return (
    <>
      <ColorSample
        from={colorFrom}
        setFrom={setColorFrom}
        to={colorTo}
        setTo={setColorTo}
        onSubmit={onSubmit}
      />
      <Container>
        {query.isSuccess && (
          <Plot
            data={[
              {
                // not a very meaningful plot with query.data instead of grays, but it'll be useful as visual feedback
                x: query.data.map(e => e.start.r),
                y: query.data.map(e => e.distance),
                type: 'scatter',
                mode: 'markers',
              },
            ]}
            layout={{ width: 320, height: 240 }}
          />
        )}
        {Math.sqrt(coeffRed)}, {Math.sqrt(coeffGreen)}, {Math.sqrt(coeffBlue)}
      </Container>
      <Gradient points={gradientColors({ b: coeffBlue, g: coeffGreen }, 150)} size={20} />
    </>
  );
}
