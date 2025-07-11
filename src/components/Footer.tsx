import React from "react";
import Image from "next/image"; // Import du composant Image
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.left}>
        <div className={styles.top}>
          <span>Coming on </span>
          <Image
            src="/abstract.svg"
            alt="Abstract Logo"
            className={styles.logoAbstract}
            width={100} // Ajustez selon les dimensions réelles
            height={50} // Ajustez selon les dimensions réelles
          />
        </div>
        <div className={styles.bottom}>
          <span>Drop with</span>
          <Image
            src="/logo-long.svg"
            alt="Abstract Logo"
            className={styles.logoHighlight}
            width={150} // Ajustez selon les dimensions réelles
            height={30} // Ajustez selon les dimensions réelles
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
          Generative art collection
          <br />
          By @Heyflaw ✌🏻
        </a>
      </div>
    </footer>
  );
}
