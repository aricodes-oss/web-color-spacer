import styles from './page.module.scss';

export default function Counter({ value, onChange }) {
  return (
    <div className={styles.row}>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}
