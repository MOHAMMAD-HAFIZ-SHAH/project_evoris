// components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = ({ user }) => {

    const [showProfile, setShowProfile] = useState(false);

    const [capsuleStats, setCapsuleStats] = useState({
        total: 0,
        unlocked: 0,
        locked: 0,
        recent: []
    });

    const [loadingData, setLoadingData] = useState(true);

    const userName = user.displayName || user.email?.split('@')[0] || "User";
    const location = useLocation();

    // -------- FETCH CAPSULE COUNTS --------
    useEffect(() => {
        const fetchCapsuleData = async () => {
            if (!user) return;

            setLoadingData(true);
            const now = new Date();
            let total = 0, unlocked = 0, locked = 0, recent = [];

            try {
                const q = query(
                    collection(db, "capsules"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );

                const snapshot = await getDocs(q);
                total = snapshot.size;

                snapshot.docs.forEach((doc) => {
                    const capsule = { id: doc.id, ...doc.data() };
                    const unlockDate = capsule.unlockDate.toDate();

                    if (unlockDate <= now) unlocked++;
                    else locked++;

                    if (recent.length < 3) {
                        recent.push({
                            id: capsule.id,
                            title: capsule.title,
                            isLocked: unlockDate > now,
                        });
                    }
                });

                setCapsuleStats({ total, unlocked, locked, recent });

            } catch (error) {
                console.error("Error fetching capsule stats:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchCapsuleData();
    }, [user]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const isActive = (path) => location.pathname === path;

    // -------- PROFILE MODAL --------
    const ProfileModal = () => {
        if (!showProfile) return null;

        const memberSince = new Date(user.metadata.creationTime).toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        return (
            <div className={styles.profileOverlay} onClick={() => setShowProfile(false)}>

                <div className={styles.profileCard} onClick={(e) => e.stopPropagation()}>

                    <button
                        className={styles.closeButton}
                        onClick={() => setShowProfile(false)}
                    >
                        ✕
                    </button>

                    <div className={styles.profileAvatar}>
                        {userName.charAt(0).toUpperCase()}
                    </div>

                    <h2 className={styles.profileName}>{userName}</h2>
                    <p className={styles.profileTag}>Premium Member</p>

                    <div className={styles.profileStats}>
                        <div className={styles.statBox}>
                            <h3>{capsuleStats.total}</h3>
                            <p>Capsules</p>
                        </div>
                        <div className={styles.statBox}>
                            <h3>{capsuleStats.unlocked}</h3>
                            <p>Unlocked</p>
                        </div>
                        <div className={styles.statBox}>
                            <h3>4.9</h3>
                            <p>Rating</p>
                        </div>
                    </div>

                    <h3 className={styles.sectionTitle}>Account Details</h3>

                    <div className={styles.detailRow}>
                        <span className={styles.detailIcon}>📧</span>
                        <div>
                            <p className={styles.detailLabel}>Email Address</p>
                            <p className={styles.detailValue}>{user.email}</p>
                        </div>
                    </div>

                    <div className={styles.detailRow}>
                        <span className={styles.detailIcon}>🛡</span>
                        <div>
                            <p className={styles.detailLabel}>Account Status</p>
                            <p className={styles.detailValue}>Verified Premium ●</p>
                        </div>
                    </div>

                    <div className={styles.detailRow}>
                        <span className={styles.detailIcon}>📅</span>
                        <div>
                            <p className={styles.detailLabel}>Member Since</p>
                            <p className={styles.detailValue}>{memberSince}</p>
                        </div>
                    </div>

                    <div className={styles.detailRow}>
                        <span className={styles.detailIcon}>🏅</span>
                        <div>
                            <p className={styles.detailLabel}>Achievements</p>
                            <p className={styles.detailValue}>Memory Keeper, Time Traveler</p>
                        </div>
                    </div>

                    <div className={styles.profileActions}>
                        <Link to="/dashboard/settings" className={styles.settingsButton}>
                            ⚙️ Settings
                        </Link>

                        <button className={styles.logoutButton} onClick={handleSignOut}>
                            ⬅ Sign Out
                        </button>
                    </div>

                </div>
            </div>
        );
    };

    return (
        <div className={styles.dashboardContainer}>

            {/* SIDEBAR */}
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <span className={styles.logoIcon}>⏱️</span>
                    <span className={styles.logoText}>EVORIS</span>
                </div>

                <nav className={styles.nav}>
                    <Link to="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
                        🔵 Overview
                    </Link>

                    <Link to="/dashboard/create-capsule" className={`${styles.navItem} ${isActive('/dashboard/create-capsule') ? styles.active : ''}`}>
                        ＋ Create Capsule
                    </Link>

                    <Link to="/dashboard/my-capsules" className={`${styles.navItem} ${isActive('/dashboard/my-capsules') ? styles.active : ''}`}>
                        💾 My Capsules
                    </Link>

                    <Link to="/dashboard/notifications" className={`${styles.navItem} ${isActive('/dashboard/notifications') ? styles.active : ''}`}>
                        🔔 Notifications
                    </Link>

                    <Link to="/dashboard/settings" className={`${styles.navItem} ${isActive('/dashboard/settings') ? styles.active : ''}`}>
                        ⚙️ Settings
                    </Link>
                </nav>

                {/* USER SECTION */}
                <div className={styles.bottomSection}>
                    <div className={styles.userSection} onClick={() => setShowProfile(true)}>
                        <div className={styles.userAvatar}>
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className={styles.userName}>{userName}</p>
                            <p className={styles.viewProfile}>View Profile</p>
                        </div>
                    </div>

                    <div className={styles.signOutButton} onClick={handleSignOut}>
                        ← Sign Out
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className={styles.mainContent}>
                <Outlet context={{ userName, capsuleStats, loadingData }} />
            </main>

            {/* PROFILE MODAL */}
            <ProfileModal />

        </div>
    );
};

export default Dashboard;
