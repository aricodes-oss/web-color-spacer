import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

export default function Counter({ value, onChange, label = 'Unlabeled Counter' }) {
  return (
    <Form.Group controlId={label}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type="number"
        min="0"
        max="255"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        defaultValue="0"
      />
    </Form.Group>
  );
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
