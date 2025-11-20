import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./ViewCapsule.module.css";

const ViewCapsule = () => {
    const { id } = useParams();
    const [capsule, setCapsule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const ref = doc(db, "capsules", id);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setCapsule(snap.data());
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!capsule)
        return (
            <div className={styles.error}>
                Capsule not found. <Link to="/dashboard/my-capsules">Go Back</Link>
            </div>
        );

    const unlockDate = capsule.unlockDate.toDate();
    const isLockedByTime = unlockDate > new Date();

    const handlePassword = () => {
        const pass = prompt("Enter Title to unlock:");
        if (pass && pass.trim() === capsule.title.trim()) {
            setUnlocked(true);
        } else {
            alert("Incorrect password.");
        }
    };

    const canView = !isLockedByTime || unlocked;

    return (
        <div className={styles.container}>
            <Link to="/dashboard/my-capsules" className={styles.backBtn}>← Back</Link>

            <h1 className={styles.title}>{capsule.title}</h1>
            <p className={styles.desc}>{capsule.description}</p>

            <p className={styles.unlockDate}>
                Unlock Date: {unlockDate.toLocaleString()}
            </p>

            {!canView ? (
                <>
                    <p className={styles.lockText}>🔒 Capsule is locked</p>
                    <button
                        className={styles.viewButton}
                        onClick={handlePassword}
                        title="Password is the capsule title"
                    >
                        Open Capsule
                    </button>
                </>
            ) : (
                <div className={styles.contentBox}>

                    {capsule?.contentStorage?.text && (
                        <div className={styles.section}>
                            <h3>📄 Text</h3>
                            <p className={styles.textContent}>{capsule.contentStorage.text}</p>
                        </div>
                    )}

                    {capsule.contentStorage?.photos?.length > 0 && (
                        <div className={styles.section}>
                            <h3>🖼 Photos</h3>
                            <div className={styles.mediaGrid}>
                                {capsule.contentStorage.photos.map((url, idx) => (
                                    <div key={idx} className={styles.mediaWrapper}>
                                        <img src={url} alt={`${capsule.title || 'Capsule'} - ${idx + 1}`} className={styles.mediaImage} />
                                        <a href={url} download className={styles.downloadBtn}>Download</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default ViewCapsule;
