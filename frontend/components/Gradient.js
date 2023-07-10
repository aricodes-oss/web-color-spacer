import PropTypes from 'prop-types';
import { Stage, Layer, Rect } from 'react-konva';
import { rgbToHex } from '@/utils';

export default function Gradient({ points, size = 10 }) {
  return (
    <Stage width={640} height={480}>
      <Layer>
        {points.map((colIdx, rowIdx) =>
          colIdx.map((point, idx) => (
            <Rect
              key={`${idx},${rowIdx}`}
              width={size}
              height={size}
              x={Math.trunc(idx) * size}
              y={Math.trunc(rowIdx) * size}
              fill={rgbToHex(point)}
            />
          )),
        )}
      </Layer>
    </Stage>
  );
}

Gradient.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        r: PropTypes.number,
        g: PropTypes.number,
        b: PropTypes.number,
      }),
    ),
  ).isRequired,

  size: PropTypes.number,
};
