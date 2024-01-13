import clsx from "clsx";
import styles from "./DNALoadingSpinner.module.css";

const DNALoadingSpinner = () => {
  return (
    <div className={styles.loader}>
      <div className={clsx(styles.dot, "blue")}></div>
      <div className={clsx(styles.dot, "green")}></div>
      <div className={clsx(styles.dot, "red")}></div>
      <div className={clsx(styles.dot, "orange")}></div>
      <div className={clsx(styles.dot, "blue")}></div>
      <div className={clsx(styles.dot, "green")}></div>
      <div className={clsx(styles.dot, "red")}></div>
      <div className={clsx(styles.dot, "orange")}></div>
      <div className={clsx(styles.dot, "blue")}></div>
      <div className={clsx(styles.dot, "green")}></div>
      <div className={clsx(styles.dot, "red")}></div>
      <div className={clsx(styles.dot, "orange")}></div>
    </div>
  );
};

export default DNALoadingSpinner;
