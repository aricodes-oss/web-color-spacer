'use client';

import { measurements } from '@/api';
import ColorSample from '@/components/ColorSample';
// import Counter from '@/components/Counter';
// import { hexToRGB } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Plot from 'react-plotly.js';

export default function Home() {
  const [colorFrom, setColorFrom] = useState('#000000');
  const [colorTo, setColorTo] = useState('#000000');
  //  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: measurements.queryKey,
    queryFn: measurements.all,
  });
  /* const mutation = useMutation({
   *   mutationFn: measurements.create,
   *   onSuccess: () => {
   *     queryClient.invalidateQueries(measurements.queryKey);
   *   },
   * }); */

  // Hide the UI until we've loaded our data
  // Note that this HAS TO COME AFTER ALL OF YOUR HOOKS (useWhatever functions)
  // See here for more information:
  // https://legacy.reactjs.org/docs/hooks-rules.html
  if (query.isLoading) {
    return null;
  }

  // You wrote a very manual version of a reducer prior, but in JS that can be
  // expressed much more succinctly. Check here for documentation on collection methods:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
  const cumulativeLength =
    query.data
      .filter(e => e.start.r === e.start.g && e.start.g === e.start.b)
      .reduce((acc, val) => acc + val.distance / (val.ed.r - val.start.r), 0) / query.data.length;

  const onSubmit = () => null;

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
