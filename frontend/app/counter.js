import styles from './page.module.scss';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

export default function Counter({ value, onChange, label }) {
  return (
    <Form.Group controlId={label}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control type="number" value={value} onChange={e => onChange(Number(e.target.value))} />
    </Form.Group>
  );
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

Counter.defaultProps = {
  label: 'Unlabeled Counter',
};
