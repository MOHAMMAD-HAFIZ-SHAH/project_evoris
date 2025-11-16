// components/DashboardOverview.js

import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'; 
import { auth, db, onAuthStateChanged } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from './Dashboard.module.css'; 

const DashboardOverview = () => {
    const navigate = useNavigate();
    const { userName = "User" } = useOutletContext() || {}; // keep username from context

    const [loadingData, setLoadingData] = useState(true);
    const [total, setTotal] = useState(0);
    const [unlocked, setUnlocked] = useState(0);
    const [locked, setLocked] = useState(0);
    const [recent, setRecent] = useState([]);

    const [currentUser, setCurrentUser] = useState(null);

    // Get logged-in user
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsub();
    }, []);

    // Fetch capsule stats
    useEffect(() => {
        if (!currentUser) return;

        const fetchCapsules = async () => {
            setLoadingData(true);

            try {
                const capsulesRef = collection(db, "capsules");
                const q = query(
                    capsulesRef,
                    where("userId", "==", currentUser.uid)
                );

                const snapshot = await getDocs(q);
                const capsules = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Total
                setTotal(capsules.length);

                // Locked vs Unlocked
                const now = new Date();
                const lockedCaps = capsules.filter(c => c.unlockDate.toDate() > now);
                const unlockedCaps = capsules.filter(c => c.unlockDate.toDate() <= now);

                setLocked(lockedCaps.length);
                setUnlocked(unlockedCaps.length);

                // Recent activity (latest 5 created)
                const recentSorted = [...capsules]
                    .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
                    .slice(0, 5)
                    .map(item => ({
                        id: item.id,
                        title: item.title,
                        isLocked: item.unlockDate.toDate() > now
                    }));

                setRecent(recentSorted);

            } catch (err) {
                console.error("Error loading dashboard stats:", err);
            }

            setLoadingData(false);
        };

        fetchCapsules();
    }, [currentUser]);

    if (loadingData) {
        return <h1 className={styles.welcomeHeading}>Loading data...</h1>;
    }

    const handleCreateClick = () => navigate('/dashboard/create-capsule');
    const handleViewClick = () => navigate('/dashboard/my-capsules');

    return (
        <>
            <h1 className={styles.welcomeHeading}>Welcome back, {userName}!</h1>
            <p className={styles.managementText}>
                Manage your digital time capsules and preserve your most precious memories
            </p>

            {/* STATUS CARDS */}
            <div className={styles.statusGrid}>
                
                {/* TOTAL */}
                <div className={styles.statusCard} style={{ backgroundColor: '#f0f4ff' }}>
                    <p className={styles.statusLabel}>Total Capsules</p>
                    <h2 className={styles.statusValue}>{total}</h2>
                    <span className={styles.statusIcon}>&#x23F1;</span>
                </div>

                {/* UNLOCKED */}
                <div className={styles.statusCard} style={{ backgroundColor: '#f0fff4' }}>
                    <p className={styles.statusLabel}>Unlocked</p>
                    <h2 className={styles.statusValue}>{unlocked}</h2>
                    <span className={styles.statusIcon} style={{ color: '#00b894' }}>
                        &#x1F513;
                    </span>
                </div>

                {/* LOCKED */}
                <div className={styles.statusCard} style={{ backgroundColor: '#fff0f0' }}>
                    <p className={styles.statusLabel}>Locked</p>
                    <h2 className={styles.statusValue}>{locked}</h2>
                    <span className={styles.statusIcon} style={{ color: '#ff7f50' }}>
                        &#x1F512;
                    </span>
                </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className={styles.actionGrid}>
                <div className={styles.createCard} onClick={handleCreateClick} role="button" tabIndex="0">
                    <div className={styles.actionIcon}>+</div>
                    <h3>Create New Capsule</h3>
                    <p>Start preserving your memories for the future</p>
                </div>

                <div className={styles.viewCard} onClick={handleViewClick} role="button" tabIndex="0">
                    <div className={styles.actionIcon}>&#x1F55C;</div>
                    <h3>View My Capsules</h3>
                    <p>Access your {total} stored time capsules</p>
                </div>
            </div>

            {/* RECENT ACTIVITY */}
            <h2 className={styles.recentActivityHeading}>Recent Activity</h2>
            <div className={styles.activityList}>
                {recent.length === 0 ? (
                    <div className={styles.emptyActivity}>
                        You have no recent activity. Create your first capsule!
                    </div>
                ) : (
                    recent.map((item) => (
                        <div key={item.id} className={styles.activityItem}>
                            <div 
                                className={styles.activityIcon} 
                                style={{ color: item.isLocked ? '#ff7f50' : '#00b894' }}
                            >
                                {item.isLocked ? '🔒' : '🔓'}
                            </div>

                            <div className={styles.activityText}>
                                <p className={styles.activityTitle}>{item.title}</p>
                                <p className={styles.activityStatus}>
                                    {item.isLocked ? 'Locked' : 'Unlocked'}
                                </p>
                            </div>

                            <button
                                className={styles.activityButton}
                                onClick={() => navigate('/dashboard/my-capsules')}
                            >
                                View
                            </button>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default DashboardOverview;
