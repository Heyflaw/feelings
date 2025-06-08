// src/components/Footer.tsx
import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.left}>
        <div className={styles.top}>
          <span>Coming on </span>
          <img
            src="/abstract.svg"
            alt="Abstract Logo"
            className={styles.logoAbstract}
          />
        </div>
        <div className={styles.bottom}>
          <span>Drop with</span>
          <img
            src="/logo-long.svg"
            alt="Abstract Logo"
            className={styles.logoHighlight}
          />
        </div>
      </div>
      <div className={styles.right}>
        <a
          href="https://x.com/@Heyflaw"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Generative art collection<br></br>By @Heyflaw ✌🏻
        </a>
      </div>
    </footer>
  );
}
