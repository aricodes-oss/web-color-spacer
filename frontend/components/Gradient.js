/* eslint-disable react/no-array-index-key */
import { rgbToHex } from '@/utils';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect } from 'react-konva';

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
              x={point.x * size}
              y={Math.trunc(rowIdx) * size}
              fill={rgbToHex(point.color)}
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
        color: PropTypes.shape({
          r: PropTypes.number,
          g: PropTypes.number,
          b: PropTypes.number,
        }),
        x: PropTypes.number,
      }),
    ),
  ).isRequired,

  size: PropTypes.number,
};
/* eslint-enable react/no-array-index-key */
