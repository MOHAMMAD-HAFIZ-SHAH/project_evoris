// components/TestimonialCta.js
import React from 'react';
import { Link } from 'react-router-dom'; // 🌟 IMPORTED LINK for routing
import styles from './TestimonialCta.module.css';

const TestimonialCta = () => {
  const testimonials = [
    { quote: "EVORIS has completely transformed how I preserve my creative journey. The anticipation of opening my annual capsules has become a cherished ritual.", name: "Sarah Chen", title: "Creative Director", initials: "SC", color: "#3498db" },
    { quote: "The most elegant way to create digital heirlooms. My family eagerly awaits our quarterly time capsule reveals - it's become our favorite tradition.", name: "Marcus Rodriguez", title: "Family Photographer", initials: "MR", color: "#8e44ad" },
    { quote: "I use EVORIS to help my clients reflect on their growth. The ability to send messages to your future self is incredibly powerful.", name: "Elena Vasquez", title: "Life Coach", initials: "EV", color: "#e67e22" },
  ];

  return (
    <section>
      {/* Testimonials Section */}
      <div className={styles.testimonialsSection}>
        <h2 className={styles.testimonialHeading}>Loved by Memory Keepers</h2>
        <p className={styles.testimonialSubheading}>
          Join thousands who trust EVORIS with their most precious memories
        </p>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p className={styles.quote}>"{t.quote}"</p>
              <div className={styles.authorContainer}>
                <div className={styles.initials} style={{ backgroundColor: t.color }}>{t.initials}</div>
                <div>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorTitle}>{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className={styles.finalCtaContainer}>
        <h2 className={styles.ctaHeading}>Ready to Begin?</h2>
        <p className={styles.ctaText}>
          Start preserving your most precious memories today with EVORIS.
        </p>
        
        {/* 🌟 REPLACED <button> with <Link to="/sign-up"> 🌟 */}
        <Link to="/sign-up" className={styles.ctaButton}>
          Create Your First Capsule
        </Link>
      </div>
    </section>
  );
};

export default TestimonialCta;