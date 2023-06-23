import PropTypes from 'prop-types';
import LabeledFormControl from './LabeledFormControl';

export default function Counter({
  label = 'Unlabeled Counter',
  min = 0,
  max = 255,
  defaultValue = 0,
  ...props
}) {
  return (
    <LabeledFormControl
      label={label}
      type="number"
      min={min}
      max={max}
      defaultValue={defaultValue}
      {...props}
    />
  );
}

Counter.propTypes = {
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
};
