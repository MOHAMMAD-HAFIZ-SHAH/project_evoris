import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth, onAuthStateChanged } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject, listAll } from "firebase/storage";
import { storage } from "../firebase";
import styles from './MyCapsules.module.css';

// ----------------- CapsuleCard -----------------
const CapsuleCard = ({ capsule, onDelete }) => {
    const unlockDate = capsule.unlockDate.toDate();
    const isLocked = unlockDate > new Date();
    const statusText = isLocked ? 'Locked' : 'Unlocked';
    const icon = isLocked ? '🔒' : '🔓';
    const statusClass = isLocked ? styles.locked : styles.unlocked;

    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={statusClass}>{icon} {statusText}</span>
                <div className={isLocked ? styles.lockIconOrange : styles.lockIconGreen}>
                    {isLocked ? '🔐' : '🗝️'}
                </div>
            </div>

            <h3 className={styles.title}>{capsule.title}</h3>

            <p className={styles.description}>
                {capsule.description.substring(0, 70)}
                {capsule.description.length > 70 ? '...' : ''}
            </p>

            <p className={styles.cardUnlockDate}>
                {isLocked
                    ? `Unlocks on: ${formatDate(unlockDate)}`
                    : `Unlocked on: ${formatDate(unlockDate)}`
                }
            </p>

            {isLocked ? (
                <button className={styles.viewButton} disabled>Locked</button>
            ) : (
                <Link
                    to={`/dashboard/capsule/${capsule.id}`}
                    className={styles.viewButton}
                >
                    View Capsule
                </Link>
            )}

            {/* DELETE BUTTON */}
            <button
                className={styles.deleteButton}
                onClick={() => onDelete(capsule)}
            >
                🗑 Delete Capsule
            </button>
        </div>
    );
};

// ----------------- MyCapsules PAGE -----------------
const MyCapsules = () => {
    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Listen for login state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) {
                setLoading(false);
                setCapsules([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch capsules
    useEffect(() => {
        if (currentUser) {
            const fetchCapsules = async () => {
                setLoading(true);
                setError(null);

                try {
                    const capsulesRef = collection(db, "capsules");
                    const q = query(capsulesRef, where("userId", "==", currentUser.uid));
                    const snapshot = await getDocs(q);

                    const fetched = snapshot.docs.map(d => ({
                        id: d.id,
                        ...d.data(),
                    }));

                    fetched.sort((a, b) => a.unlockDate.toDate() - b.unlockDate.toDate());

                    setCapsules(fetched);
                } catch (err) {
                    console.error("Error fetching:", err);
                    setError("Failed to load your time capsules.");
                } finally {
                    setLoading(false);
                }
            };

            fetchCapsules();
        }
    }, [currentUser]);

    // ⭐ DELETE CAPSULE FUNCTION ⭐
    const handleDeleteCapsule = async (capsule) => {
        const confirmDelete = window.confirm(`Delete "${capsule.title}"? This cannot be undone.`);
        if (!confirmDelete) return;

        try {
            if (!capsule.folderPath) {
                alert("Cannot delete: missing storage folderPath.");
                return;
            }

            // Delete all files in the capsule folder
            const folderRef = ref(storage, capsule.folderPath);
            const list = await listAll(folderRef);

            for (const file of list.items) {
                await deleteObject(file);
            }

            // Delete Firestore doc
            await deleteDoc(doc(db, "capsules", capsule.id));

            // Remove from UI
            setCapsules(prev => prev.filter(c => c.id !== capsule.id));

            alert("Capsule deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete capsule. Check console.");
        }
    };

    if (loading) return <div className={styles.loading}>Loading your capsules...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!currentUser) return <div className={styles.error}>Please log in.</div>;

    return (
        <div className={styles.myCapsulesContainer}>
            <div className={styles.headerBar}>
                <h1 className={styles.pageHeading}>My Time Capsules</h1>

                <div className={styles.searchBar}>
                    <input type="text" placeholder="Search Capsules..." />
                    <button>&#x1F50D;</button>
                </div>
            </div>

            {capsules.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>You haven't created any time capsules yet.</p>
                    <Link to="/dashboard/create-capsule" className={styles.createLink}>
                        Create Your First Capsule ➕
                    </Link>
                </div>
            ) : (
                <div className={styles.capsulesGrid}>
                    {capsules.map(capsule => (
                        <CapsuleCard
                            key={capsule.id}
                            capsule={capsule}
                            onDelete={handleDeleteCapsule}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCapsules;
