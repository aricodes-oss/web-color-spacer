import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

export default function LabeledFormControl({
  value,
  onChange,
  label = 'Unlabeled Control',
  ...props
}) {
  return (
    <Form.Group controlId={label}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control value={value} onChange={e => onChange(e.target.value)} {...props} />
    </Form.Group>
  );
}

LabeledFormControl.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
