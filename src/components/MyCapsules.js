import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth, onAuthStateChanged } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject, listAll } from "firebase/storage";
import { storage } from "../firebase";
import styles from './MyCapsules.module.css';

const CapsuleCard = ({ capsule, onDelete }) => {
    const navigate = useNavigate();

    const unlockDate = capsule.unlockDate.toDate();
    const isLocked = unlockDate > new Date();

    const handleOpenCapsule = () => {
        const pass = prompt("Enter Title to open this capsule:");

        if (!pass) return;

        if (pass.trim() === capsule.title.trim()) {
            navigate(`/dashboard/capsule/${capsule.id}`);
        } else {
            alert("Incorrect password!");
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={isLocked ? styles.locked : styles.unlocked}>
                    {isLocked ? "🔒 Locked" : "🔓 Unlocked"}
                </span>
            </div>

            <h3 className={styles.title}>{capsule.title}</h3>

            <p className={styles.description}>
                {capsule.description.substring(0, 70)}
                {capsule.description.length > 70 ? "..." : ""}
            </p>

            <p className={styles.cardUnlockDate}>
                Unlocks on: {unlockDate.toLocaleString()}
            </p>

            {/* NEW BUTTON */}
            {isLocked ? (
                <button
                    className={styles.viewButton}
                    onClick={handleOpenCapsule}
                    title="Password is your title"
                >
                    Open Capsule
                </button>
            ) : (
                <Link to={`/dashboard/capsule/${capsule.id}`} className={styles.viewButton}>
                    View Capsule
                </Link>
            )}

            <button className={styles.deleteButton} onClick={() => onDelete(capsule)}>
                🗑 Delete Capsule
            </button>
        </div>
    );
};

const MyCapsules = () => {
    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) {
                setCapsules([]);
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const load = async () => {
                try {
                    const q = query(
                        collection(db, "capsules"),
                        where("userId", "==", currentUser.uid)
                    );
                    const snap = await getDocs(q);
                    const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                    arr.sort((a, b) => a.unlockDate.toDate() - b.unlockDate.toDate());
                    setCapsules(arr);
                } catch (err) {
                    console.error(err);
                    setError("Failed to load capsules");
                } finally {
                    setLoading(false);
                }
            };
            load();
        }
    }, [currentUser]);

    const handleDeleteCapsule = async (capsule) => {
        if (!window.confirm("Delete this capsule?")) return;

        try {
            const folderRef = ref(storage, capsule.folderPath);
            const files = await listAll(folderRef);
            for (const f of files.items) await deleteObject(f);

            await deleteDoc(doc(db, "capsules", capsule.id));
            setCapsules(prev => prev.filter(c => c.id !== capsule.id));

            alert("Deleted successfully!");
        } catch (e) {
            console.error(e);
            alert("Delete failed.");
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.myCapsulesContainer}>
            <h1 className={styles.pageHeading}>My Time Capsules</h1>

            <div className={styles.capsulesGrid}>
                {capsules.map(c => (
                    <CapsuleCard key={c.id} capsule={c} onDelete={handleDeleteCapsule} />
                ))}
            </div>
        </div>
    );
};

export default MyCapsules;
