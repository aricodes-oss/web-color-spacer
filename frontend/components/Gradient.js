import PropTypes from 'prop-types';
import { Stage, Layer, Rect } from 'react-konva';

export default function Gradient({ points, size = 10, rows = 10, columns = 10 }) {
  return (
    <Stage width={640} height={480}>
      <Layer>
        {points.map((point, idx) => (
          <Rect
            key={point.id}
            width={size}
            height={size}
            x={Math.trunc(idx % rows) * size}
            y={Math.trunc(idx / columns) * size}
            fill={point.start.hex}
          />
        ))}
      </Layer>
    </Stage>
  );
}

Gradient.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      hex: PropTypes.string,
    }),
  ).isRequired,

  size: PropTypes.number,
  rows: PropTypes.number,
  columns: PropTypes.number,
};
