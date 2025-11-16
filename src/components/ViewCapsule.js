import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import styles from "./ViewCapsule.module.css";

const ViewCapsule = () => {
    const { id } = useParams();
    const [capsule, setCapsule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCapsule = async () => {
            try {
                const capsuleRef = doc(db, "capsules", id);
                const snapshot = await getDoc(capsuleRef);

                if (snapshot.exists()) {
                    setCapsule(snapshot.data());
                }
            } catch (err) {
                console.error("Error loading capsule:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCapsule();
    }, [id]);

    if (loading) return <div className={styles.loading}>Loading...</div>;

    if (!capsule) {
        return (
            <div className={styles.error}>
                Capsule not found.
                <Link to="/dashboard/my-capsules">Go Back</Link>
            </div>
        );
    }

    const unlockDate = capsule.unlockDate.toDate();
    const isLocked = unlockDate > new Date();

    return (
        <div className={styles.container}>
            <Link to="/dashboard/my-capsules" className={styles.backBtn}>← Back</Link>

            <h1 className={styles.title}>{capsule.title}</h1>
            <p className={styles.desc}>{capsule.description}</p>

            <p className={styles.unlockDate}>
                Unlock Date: {unlockDate.toLocaleString()}
            </p>

            {isLocked ? (
                <p className={styles.lockText}>
                    🔒 This capsule is locked until the unlock date.
                </p>
            ) : (
                <div className={styles.contentBox}>

                    {/* Text */}
                    {capsule?.contentStorage?.text && (
                        <div className={styles.section}>
                            <h3>📄 Text</h3>
                            <p>{capsule.contentStorage.text}</p>
                        </div>
                    )}

                    {/* Photos */}
                    {capsule?.contentStorage?.photos?.length > 0 && (
                        <div className={styles.section}>
                            <h3>🖼 Photos</h3>
                            <div className={styles.mediaGrid}>
                                {capsule.contentStorage.photos.map((url, index) => (
                                    <div key={index} className={styles.mediaWrapper}>
                                        <img
                                            src={url}
                                            alt=""
                                            className={styles.mediaImage}
                                            onClick={() => window.open(url, "_blank")}
                                        />
                                        <a href={url} download className={styles.downloadBtn}>
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Videos */}
                    {capsule?.contentStorage?.videos?.length > 0 && (
                        <div className={styles.section}>
                            <h3>🎥 Videos</h3>
                            <div className={styles.mediaGrid}>
                                {capsule.contentStorage.videos.map((url, index) => (
                                    <div key={index} className={styles.mediaWrapper}>
                                        <video
                                            src={url}
                                            controls
                                            className={styles.mediaVideo}
                                            onClick={() => window.open(url, "_blank")}
                                        ></video>
                                        <a href={url} download className={styles.downloadBtn}>
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Audio */}
                    {capsule?.contentStorage?.audio?.length > 0 && (
                        <div className={styles.section}>
                            <h3>🎵 Audio</h3>
                            <div className={styles.mediaGrid}>
                                {capsule.contentStorage.audio.map((url, index) => (
                                    <div key={index} className={styles.mediaWrapper}>
                                        <audio
                                            src={url}
                                            controls
                                            className={styles.mediaAudio}
                                        ></audio>
                                        <a href={url} download className={styles.downloadBtn}>
                                            Download
                                        </a>
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
