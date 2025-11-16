// In components/Header.js, update the 'Get Started' button:
import React from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>&#x23F1;</span> EVORIS
      </div>
      
      {/* Navigation Links */}
      <nav className={styles.nav}>
        <Link to="/sign-in" className={styles.signInLink}> {/* Use Link for Sign In */}
          Sign In
        </Link>
        <Link to="/sign-up" className={styles.getStartedButton}>
          Get Started
        </Link>
      </nav>
    </header>
  );
};

export default Header;