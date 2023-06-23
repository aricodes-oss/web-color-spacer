import LabeledFormControl from './LabeledFormControl';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

export default function ColorPicker({ label = 'Unlabeled Counter', ...props }) {
  return <LabeledFormControl label={label} type="color" defaultValue="#000000" {...props} />;
}

ColorPicker.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
