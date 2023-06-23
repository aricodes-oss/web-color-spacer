import PropTypes from 'prop-types';
import LabeledFormControl from './LabeledFormControl';

const defaultLabel = 'Unlabeled Counter';

export default function ColorPicker({ label = defaultLabel, ...props }) {
  return <LabeledFormControl label={label} type="color" defaultValue="#000000" {...props} />;
}

ColorPicker.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
