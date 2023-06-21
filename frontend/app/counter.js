import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

export default function Counter({ value, onChange, label = 'Unlabeled Counter' }) {
  return (
    <Form.Group controlId={label}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        defaultValue="#000000"
      />
    </Form.Group>
  );
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
