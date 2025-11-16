// components/Settings.js (Corrected)

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './Settings.module.css'; 

// Receive dark mode props, but only use the state for visual checkmark.
const Settings = ({ isDarkMode, setDarkMode }) => {
    // Get user context from the Dashboard layout
    const { userName, user } = useOutletContext();

    // 1. Profile Information State
    const [profile, setProfile] = useState({
        fullName: user?.displayName || userName || 'User Name',
        email: user?.email || 'user@example.com',
    });

    // 2. Preferences State (FORCE Dark Mode ON for display purposes)
    const [preferences, setPreferences] = useState({
        // This is always TRUE because we enforce dark mode visually and functionally.
        darkMode: true, 
    });

    // 🌟 FIX: Add the missing handleProfileChange function 🌟
    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // We do NOT use the setDarkMode prop here, as we are enforcing the dark theme globally 
    // for this section via the logic in App.js and the CSS. 
    // This function only manages local state which is fixed to 'true'.
    const handlePreferenceToggle = (name) => {
        if (name === 'darkMode') {
            // Log that the toggle was clicked but prevent it from changing the state
            console.log('Dark Mode toggle clicked, but dark mode is currently enforced and cannot be switched off.');
            setPreferences(prev => ({ ...prev, darkMode: true })); 
        }
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // Placeholder for actual update logic 
        console.log("Updating profile:", profile);
        alert("Profile update initiated (Check console for mock data)");
    };

    // Helper component for the disabled switch appearance
    const DisabledSwitch = ({ checked }) => (
        <label className={`${styles.switch} ${styles.disabled}`}> 
            <input 
                type="checkbox" 
                checked={checked}
                disabled 
            />
            <span className={styles.slider}></span>
        </label>
    );

    return (
        <div className={styles.settingsPage}>
            <h1 className={styles.settingsHeading}>Settings</h1>
            
            <div className={styles.settingsGrid}>
                
                {/* 1. Profile Information */}
                <div className={styles.card}>
                    <h3>Profile Information</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={profile.fullName}
                            // FIX APPLIED HERE: Now correctly referencing the function above
                            onChange={handleProfileChange} 
                            placeholder="Enter your full name"
                            className={styles.inputField}
                        />

                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            disabled 
                            placeholder="user@example.com"
                            className={styles.inputField}
                        />

                        <button type="submit" className={styles.updateButton}>
                            Update Profile
                        </button>
                    </form>
                </div>

                {/* 2. Security Settings */}
                <div className={styles.card}>
                    <h3>Security Settings</h3>
                    
                    <div className={styles.securityItem}>
                        <div className={styles.securityText}>
                            <h4>Change Password</h4>
                            <p>Update your account password</p>
                        </div>
                        <button className={styles.securityButton}>Change</button>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.securityText}>
                            <h4>Two-Factor Authentication</h4>
                            <p>Add an extra layer of security</p>
                        </div>
                        <button className={styles.securityButton}>Setup</button>
                    </div>
                </div>

                {/* 3. Preferences (ONLY Dark Mode is functional - but FIXED ON) */}
                <div className={styles.card}>
                    <h3>Preferences</h3>

                    {/* 1. Dark Mode Toggle (FORCED ON) */}
                    <div className={styles.preferenceItem}>
                        <div className={styles.preferenceText}>
                            <h4>Dark Mode</h4>
                            <p>Toggle dark theme</p>
                        </div>
                        <label className={styles.switch}>
                            <input 
                                type="checkbox" 
                                checked={preferences.darkMode} // Always true
                                onChange={() => handlePreferenceToggle('darkMode')}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {/* 2. Email Notifications Toggle (DISABLED) */}
                    <div className={styles.preferenceItem}>
                        <div className={styles.preferenceText}>
                            <h4>Email Notifications</h4>
                            <p>Receive unlock reminders</p>
                        </div>
                        <DisabledSwitch checked={true} /> 
                    </div>

                    {/* 3. Push Notifications Toggle (DISABLED) */}
                    <div className={styles.preferenceItem}>
                        <div className={styles.preferenceText}>
                            <h4>Push Notifications</h4>
                            <p>Browser notifications</p>
                        </div>
                        <DisabledSwitch checked={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;