// components/FeaturesSection.js
import React from 'react';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const stats = [
    { icon: '&#x1F46A;', value: '50,000+', label: 'Active Users' },
    { icon: '&#x23F0;', value: '2.5M+', label: 'Capsules Created' },
    { icon: '&#x2B50;', value: '4.9/5', label: 'Trust Rating' },
    { icon: '&#x1F451;', value: '12+', label: 'Industry Awards' },
  ];

  const features = [
    { icon: '&#x1F6E1;', title: 'Bank-Level Security', text: 'End-to-end encryption with zero-knowledge architecture ensures your memories remain completely private and secure.', color: '#38A169' },
    { icon: '&#x1F51E;', title: 'Rich Media Vault', text: 'Seamlessly store photos, videos, audio recordings, and personal notes in beautifully organized time capsules.', color: '#8A2BE2' },
    { icon: '&#x1F4C5;', title: 'Precision Time-Locking', text: 'Set exact dates and times for automated unlocking, creating anticipation for future revelations.', color: '#F6AD55' },
    { icon: '&#x2728;', title: 'Magical Revelations', text: 'Experience the profound joy of rediscovering your past through our thoughtfully crafted reveal experience.', color: '#C432A3' },
  ];

  return (
    <section className={styles.section}>
      {/* Top Stats Row */}
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <span className={styles.statIcon} dangerouslySetInnerHTML={{ __html: stat.icon }} style={{ color: stat.color }}></span>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Heading */}
      <h2 className={styles.heading}>Why Choose EVORIS?</h2>
      <p className={styles.subheading}>
        Experience the future of memory preservation with our meticulously crafted platform
        designed for the discerning digital curator.
      </p>

      {/* Features Grid */}
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ backgroundColor: `${feature.color}1a` }}>
              <span className={styles.featureIcon} dangerouslySetInnerHTML={{ __html: feature.icon }} style={{ color: feature.color }}></span>
            </div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureText}>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;