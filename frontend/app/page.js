'use client';

import { measurements } from '@/api';
import ColorSample from '@/components/ColorSample';
import { hexToRGB } from '@/utils';
// import Counter from '@/components/Counter';
// import { hexToRGB } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Plot from 'react-plotly.js';

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

  const cumulativeLength =
    query.data
      .filter(
        e =>
          e.start.r === e.start.g &&
          e.start.g === e.start.b &&
          e.end.r === e.end.g &&
          e.end.g === e.end.b,
      )
      .reduce((acc, val) => acc + val.distance / (val.end.r - val.start.r), 0) / query.data.length;

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
    </>
  );
}
