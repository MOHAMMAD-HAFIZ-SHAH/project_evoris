// components/MainContent.js
import React from 'react';
import { Link } from 'react-router-dom'; // 🌟 NEW IMPORT for routing
import styles from './MainContent.module.css';

const MainContent = () => {
  return (
    <main className={styles.main}>
      {/* Trust Badge */}
      <p className={styles.trustBadge}>
        ✅ Trusted by **50,000+ memory keepers** worldwide
      </p>

      {/* Main Headline */}
      <h1 className={styles.headline}>
        <span className={styles.preserve}>Preserve Today,</span>
        <span className={styles.treasure}> Treasure Tomorrow</span>
      </h1>

      {/* Description */}
      <p className={styles.description}>
        Create exquisite digital time capsules filled with your most precious memories. 
        Lock them away with intention and rediscover the magic when the moment is perfect.
      </p>

      {/* Call to Action Buttons */}
      <div className={styles.ctaContainer}>
        
        {/* 🌟 LINKED TO SIGN UP (/sign-up) 🌟 */}
        <Link to="/sign-up" className={styles.primaryCta}>
          Begin Your Journey →
        </Link>
        
        {/* 🌟 LINKED TO SIGN IN (/sign-in) 🌟 */}
        <Link to="/sign-in" className={styles.secondaryCta}>
          I Have an Account
        </Link>
      </div>
    </main>
  );
};

export default MainContent;