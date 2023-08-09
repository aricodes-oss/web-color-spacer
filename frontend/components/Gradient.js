/* eslint-disable react/no-array-index-key */
import { Boundary } from '@/schema';
import { rgbToHex } from '@/utils';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect } from 'react-konva';

export default function Gradient({ planes, offset = 0, size = 10 }) {
  if (planes[offset] === undefined) {
    planes[offset] = {};
  }
  // broken
  return (
    <Stage width={640} height={480}>
      <Layer>
        {Object.keys(planes[offset]).forEach(keyY =>
          Object.keys(planes[offset][keyY]).forEach(keyZ => (
            <Rect
              key={`${keyY}, ${keyZ}`}
              width={size}
              height={size}
              x={keyY * size}
              y={keyZ * size}
              fill={rgbToHex(planes[offset][keyY][keyZ])}
            />
          )),
        )}
      </Layer>
    </Stage>
  );
}

/*
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
}; */
/* eslint-enable react/no-array-index-key */
