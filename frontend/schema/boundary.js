import PropTypes from 'prop-types';
import { createModelSchema, object, primitive, deserialize, serialize } from 'serializr';

export class Bounds {
  upper = 0;
  lower = 0;

  adjacent = val => this.isUnder(val) || this.isOver(val);
  isUnder = val => val === this.under;
  isOver = val => val === this.over;

  eq = bound => bound.upper === this.upper && bound.lower === this.lower;

  get under() {
    return this.lower - 1;
  }

  get over() {
    return this.upper + 1;
  }

  static from = obj => deserialize(Bounds, obj);
  static shape = PropTypes.shape({
    lower: PropTypes.number.isRequired,
    upper: PropTypes.number.isRequired,
  });
}

class Boundary {
  x = new Bounds();
  y = new Bounds();
  z = new Bounds();

  adjacent = point =>
    Object.keys(serialize(point))
      .map(axis => this[axis].adjacent(point[axis]))
      .every(Boolean);
  eq = boundary => boundary.axes.every((axis, idx) => this.axes[idx].eq(axis));

  expandTowards = position => {
    Object.keys(serialize(position)).forEach(axis => {
      if (this[axis].isOver(position[axis])) {
        this[axis].upper += 1;
      }

      if (this[axis].isUnder(position[axis])) {
        this[axis].lower -= 1;
      }
    });
  };

  get axes() {
    return [this.x, this.y, this.z];
  }

  static from = obj => deserialize(Boundary, obj);

  static shape = PropTypes.shape({
    x: Bounds.shape,
    y: Bounds.shape,
    z: Bounds.shape,
  });
}

createModelSchema(Bounds, {
  upper: primitive(),
  lower: primitive(),
});

createModelSchema(Boundary, {
  x: object(Bounds),
  y: object(Bounds),
  z: object(Bounds),
});

export default Boundary;
