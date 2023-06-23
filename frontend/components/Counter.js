import LabeledFormControl from './LabeledFormControl';
import PropTypes from 'prop-types';

export default function Counter({
  label = 'Unlabeled Counter',
  min = 0,
  max = 255,
  defaultValue = 0,
  ...props
}) {
  return <LabeledFormControl label={label} type="number" min={min} max={max} {...props} />;
}

Counter.propTypes = {
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
};
