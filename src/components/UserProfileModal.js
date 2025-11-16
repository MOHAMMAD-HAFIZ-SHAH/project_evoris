import React from "react";
import styles from "./UserProfileModal.module.css";

const UserProfileModal = ({ user, onClose, stats, onSignOut }) => {
    if (!user) return null;

    const userName = user.displayName || user.email?.split("@")[0] || "User";
    const avatarLetter = userName.charAt(0).toUpperCase();

    const memberSince = new Date(user.metadata.creationTime).toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                {/* Close Button */}
                <button className={styles.closeBtn} onClick={onClose}>✕</button>

                {/* Avatar */}
                <div className={styles.avatar}>{avatarLetter}</div>

                <h2 className={styles.name}>{userName}</h2>
                <p className={styles.memberType}>Premium Member</p>

                {/* ⭐ DYNAMIC STATS ⭐ */}
                <div className={styles.statsRow}>

                    <div className={styles.statBox}>
                        <span className={styles.statIcon}>⏱️</span>
                        <h3>{stats.total}</h3>
                        <p>Capsules</p>
                    </div>

                    <div className={styles.statBox}>
                        <span className={styles.statIcon}>🔓</span>
                        <h3>{stats.unlocked}</h3>
                        <p>Unlocked</p>
                    </div>

                    <div className={styles.statBox}>
                        <span className={styles.statIcon}>⭐</span>
                        <h3>4.9</h3>
                        <p>Rating</p>
                    </div>

                </div>

                {/* ACCOUNT DETAILS */}
                <h3 className={styles.sectionTitle}>Account Details</h3>

                <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📧</span>
                    <div>
                        <p className={styles.detailLabel}>Email Address</p>
                        <p className={styles.detailText}>{user.email}</p>
                    </div>
                </div>

                <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🛡️</span>
                    <div>
                        <p className={styles.detailLabel}>Account Status</p>
                        <p className={styles.detailText}>Verified Premium ●</p>
                    </div>
                </div>

                <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📅</span>
                    <div>
                        <p className={styles.detailLabel}>Member Since</p>
                        <p className={styles.detailText}>{memberSince}</p>
                    </div>
                </div>

                <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🏅</span>
                    <div>
                        <p className={styles.detailLabel}>Achievements</p>
                        <p className={styles.detailText}>Memory Keeper, Time Traveler</p>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className={styles.bottomBtns}>
                    <button className={styles.settingsBtn}>⚙️ Settings</button>

                    {/* now sign out triggers real function */}
                    <button className={styles.logoutBtn} onClick={onSignOut}>
                        ↩ Sign Out
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserProfileModal;
