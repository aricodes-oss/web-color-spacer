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
        // for some reason, lightnessFrom etc are becoming strings when updated
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
    </>
  );
}
