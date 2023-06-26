import Counter from '@/components/Counter';
// import { hexToRGB } from '@/utils';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import styles from './ColorSample.module.scss';
import ColorPicker from './ColorPicker';

export default function ColorSample({ from, to, setFrom, setTo, onSubmit }) {
  const [lightness, setLightness] = useState(0);

  const [fromProps, toProps] = [
    {
      value: from,
      onChange: setFrom,
      label: 'From',
    },
    {
      value: to,
      onChange: setTo,
      label: 'To',
    },
  ];

  return (
    <Container>
      <Row>
        <Col>
          <Stack>
            <div
              className={styles.rectangle}
              // using isNaN as a janky hack to check if it's hex or int, because it'll be a string either way for some reason
              style={{ backgroundColor: isNaN(from) ? from : `rgb(${from},${from},${from})` }}
            />
            <div
              className={styles.rectangle}
              style={{ backgroundColor: isNaN(to) ? to : `rgb(${to},${to},${to})` }}
            />
          </Stack>
        </Col>

        <Col>
          <Stack>
            <div className={classNames(styles.rectangle, styles.black)} />
            <div
              className={styles.rectangle}
              style={{ backgroundColor: `rgb(${lightness}, ${lightness}, ${lightness})` }}
            />
          </Stack>
        </Col>
      </Row>

      <Row>
        <Col>
          {isNaN(from) ? <ColorPicker {...fromProps} /> : <Counter {...fromProps} />}
          {isNaN(to) ? <ColorPicker {...toProps} /> : <Counter {...toProps} />}
        </Col>
        <Col>
          <Counter value={lightness} onChange={setLightness} label="Compare" />
        </Col>
      </Row>

      <Button
        variant="primary"
        onClick={() => {
          onSubmit(lightness);
        }}
      >
        Submit
      </Button>
    </Container>
  );
}

ColorSample.propTypes = {
  from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setFrom: PropTypes.func.isRequired,
  setTo: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
