import PropTypes from 'prop-types';
import LabeledFormControl from './LabeledFormControl';

export default function Counter({
  label = 'Unlabeled Counter',
  min = 0,
  max = 255,
  defaultValue = 0,
  onChange,
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
      onChange={e => onChange(Number(e.target.value))}
    />
  );
}

Counter.propTypes = {
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};
