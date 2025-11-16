import React from "react";
import styles from "./ViewProfile.module.css";

const ViewProfile = ({ user, onClose, capsuleStats }) => {
    const userName = user.displayName || user.email?.split("@")[0] || "User";
    const email = user.email;

    const memberSince = new Date(user.metadata.creationTime).toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    // 📌 Capsule Stats (comes from Dashboard.js)
    const totalCapsules = capsuleStats?.total || 0;
    const unlockedCapsules = capsuleStats?.unlocked || 0;
    const lockedCapsules = capsuleStats?.locked || 0;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                {/* Close button */}
                <button className={styles.closeBtn} onClick={onClose}>✕</button>

                {/* Profile Avatar */}
                <div className={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>

                <h2 className={styles.name}>{userName}</h2>
                <p className={styles.subtitle}>Premium Member</p>

                {/* 🔥 Dynamic Stats */}
                <div className={styles.statsRow}>

                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>⏱</span>
                        <h3>{totalCapsules}</h3>
                        <p>Total Capsules</p>
                    </div>

                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🔓</span>
                        <h3>{unlockedCapsules}</h3>
                        <p>Unlocked</p>
                    </div>

                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🔒</span>
                        <h3>{lockedCapsules}</h3>
                        <p>Locked</p>
                    </div>
                </div>

                {/* Account Details */}
                <div className={styles.details}>
                    <h3>Account Details</h3>

                    <div className={styles.detailItem}>
                        <span className={styles.detailIcon}>✉</span>
                        <div>
                            <p className={styles.label}>Email Address</p>
                            <p className={styles.value}>{email}</p>
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailIcon}>🛡</span>
                        <div>
                            <p className={styles.label}>Account Status</p>
                            <p className={styles.value}>Verified Premium ●</p>
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailIcon}>📅</span>
                        <div>
                            <p className={styles.label}>Member Since</p>
                            <p className={styles.value}>{memberSince}</p>
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailIcon}>🏅</span>
                        <div>
                            <p className={styles.label}>Achievements</p>
                            <p className={styles.value}>Memory Keeper, Time Traveler</p>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className={styles.actions}>
                    <button className={styles.settingsBtn}>⚙ Settings</button>
                    <button className={styles.logoutBtn} onClick={onClose}>↩ Close</button>
                </div>

            </div>
        </div>
    );
};

export default ViewProfile;
