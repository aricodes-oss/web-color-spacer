'use client';

import { measurements } from '@/api';
import ColorSample from '@/components/ColorSample';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Plot from 'react-plotly.js';

export default function Home() {
  const [lightnessFrom, setLightnessFrom] = useState(0);
  const [lightnessTo, setLightnessTo] = useState(0);

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

  const onSubmit = lightness =>
    mutation.mutate({
      start: {
        // Probably fine to remove the Number() now, but I don't want to have to test to make sure
        r: Number(lightnessFrom),
        g: Number(lightnessFrom),
        b: Number(lightnessFrom),
      },
      end: {
        r: Number(lightnessTo),
        g: Number(lightnessTo),
        b: Number(lightnessTo),
      },
      distance: Number(lightness),
    });

  if (query.isLoading) {
    return null;
  }

  const grays = query.data.filter(
    e =>
      e.start.r === e.start.g &&
      e.start.g === e.start.b &&
      e.end.r === e.end.g &&
      e.end.g === e.end.b,
  );

  const cumulativeLength =
    grays.reduce((acc, val) => acc + val.distance / (val.end.r - val.start.r), 0) / grays.length;

  return (
    <>
      <ColorSample
        from={lightnessFrom}
        setFrom={setLightnessFrom}
        to={lightnessTo}
        setTo={setLightnessTo}
        onSubmit={onSubmit}
      />
      <Container>
        {query.isSuccess && (
          <Plot
            data={[
              {
                x: grays.map(e => e.start.r),
                y: grays.map(e => e.distance),
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
