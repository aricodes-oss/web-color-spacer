import PropTypes from 'prop-types';
import LabeledFormControl from './LabeledFormControl';

export default function Counter({
  label = 'Unlabeled Counter',
  min = 0,
  max = 255,
  // defaultValue = 0,
  onChange,
  ...props
}) {
  return (
    <LabeledFormControl
      label={label}
      type="number"
      min={min}
      max={max}
      {...props}
      onChange={val => onChange(Number(val))}
    />
  );
}

Counter.propTypes = {
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
};
