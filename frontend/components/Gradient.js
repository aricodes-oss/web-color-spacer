/* eslint-disable react/no-array-index-key */
import { Boundary } from '@/schema';
import { rgbToHex } from '@/utils';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect } from 'react-konva';

export default function Gradient({ planes, offset = 0, size = 10 }) {
  let depth = offset + planes.center;
  // could use a proper clamping function here for brevity
  if (depth < 0) {
    depth = 0;
  }
  if (depth > planes.points.length - 1) {
    depth = planes.points.length - 1;
  }
  return (
    <Stage width={640} height={480}>
      <Layer>
        {planes.points[depth].map((point, idx) => (
          <Rect
            key={`${idx}`}
            width={size}
            height={size}
            x={(point.position.x - planes.boundaries.x.lower) * size}
            y={(point.position.y - planes.boundaries.y.lower) * size}
            fill={rgbToHex(point.color)}
          />
        ))}
      </Layer>
    </Stage>
  );
}

Gradient.propTypes = {
  planes: PropTypes.shape({
    center: PropTypes.number,
    boundaries: Boundary.shape,
    points: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.shape({
            r: PropTypes.number,
            g: PropTypes.number,
            b: PropTypes.number,
          }),
          position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
          }),
        }),
      ),
    ),
  }).isRequired,

  offset: PropTypes.number,
  size: PropTypes.number,
};
/* eslint-enable react/no-array-index-key */
