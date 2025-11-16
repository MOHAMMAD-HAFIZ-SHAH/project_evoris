import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Correct imports
import { auth, db, storage } from '../firebase'; 
import { collection, addDoc, Timestamp } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

import styles from './CreateCapsuleForm.module.css';

// ---------------------- File Uploader Component ----------------------
const FileUploader = ({ contentType, onFileChange }) => {
    let acceptTypes;

    switch (contentType) {
        case 'photos': acceptTypes = 'image/*'; break;
        case 'videos': acceptTypes = 'video/*'; break;
        case 'audio': acceptTypes = 'audio/*'; break;
        default: acceptTypes = '*/*';
    }

    return (
        <div className={styles.fileUploader}>
            <label className={styles.uploadLabel}>
                Select {contentType.charAt(0).toUpperCase() + contentType.slice(1)}:
            </label>
            <input
                type="file"
                multiple
                accept={acceptTypes}
                onChange={(e) => onFileChange(e.target.files)}
                className={styles.fileInput}
            />
        </div>
    );
};

// ---------------------- MAIN COMPONENT ----------------------
const CreateCapsuleForm = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [unlockDate, setUnlockDate] = useState('');

    const [selectedTypes, setSelectedTypes] = useState({
        photos: false,
        audio: false,
        videos: false,
        text: false
    });

    const [capsuleContent, setCapsuleContent] = useState({
        photos: [],
        videos: [],
        audio: [],
        text: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Handle file changes
    const handleFileChange = (type, files) => {
        setCapsuleContent(prev => ({ ...prev, [type]: Array.from(files) }));
    };

    // Handle text input
    const handleTextChange = (e) => {
        setCapsuleContent(prev => ({ ...prev, text: e.target.value }));
    };

    // Re-usable upload function
    const uploadFile = async (file, path) => {
        const storageRef = ref(storage, `${path}/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };


    // ---------------------- SAVE CAPSULE ----------------------
    const handleSaveCapsule = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const user = auth.currentUser;
        const unlockTime = new Date(unlockDate);
        const now = new Date();

        if (!user || !title || !description || !unlockDate || unlockTime <= now) {
            setError("Please fill all fields properly and choose a future unlock date.");
            setLoading(false);
            return;
        }

        const selected = Object.keys(selectedTypes).filter(k => selectedTypes[k]);
        const hasContent = selected.some(type =>
            type === "text"
                ? capsuleContent.text.trim().length > 0
                : capsuleContent[type].length > 0
        );

        if (!hasContent) {
            setError("Upload content for the types you selected.");
            setLoading(false);
            return;
        }

        try {
            const uploadedUrls = {};

            // ⭐ Create a unique capsule folder (same used for deletion)
            const capsuleIdTime = Date.now();
            const baseFolderPath = `capsules/${user.uid}/${capsuleIdTime}`;

            // Upload files
            for (const type of selected) {
                if (type === 'text') {
                    uploadedUrls.text = capsuleContent.text;
                } else {
                    const files = capsuleContent[type];
                    const uploadPath = `${baseFolderPath}/${type}`;

                    const urls = await Promise.all(
                        files.map(file => uploadFile(file, uploadPath))
                    );

                    uploadedUrls[type] = urls;
                }
            }

            const unlockTimestamp = Timestamp.fromDate(unlockTime);
            const createdTimestamp = Timestamp.now();

            // ⭐ Save Firestore metadata including folderPath
            const newCapsule = {
                userId: user.uid,
                title,
                description,
                unlockDate: unlockTimestamp,
                createdAt: createdTimestamp,
                folderPath: baseFolderPath,     // ⭐ VERY IMPORTANT FOR DELETE
                contentTypes: selected,
                status: "Locked",
                contentStorage: uploadedUrls
            };

            await addDoc(collection(db, "capsules"), newCapsule);

            alert("Capsule saved successfully!");
            navigate('/dashboard/my-capsules');

        } catch (err) {
            console.error("Error saving capsule:", err);
            setError("Failed to save capsule. Check console.");
        }

        setLoading(false);
    };


    // ---------------------- UI ----------------------
    return (
        <div className={styles.capsuleFormContainer}>
            <div className={styles.capsuleCard}>
                <h2 className={styles.heading}>Create New Time Capsule 🕰️</h2>

                {error && <p className={styles.errorText}>{error}</p>}

                <form onSubmit={handleSaveCapsule}>
                    
                    <label className={styles.label}>Capsule Title</label>
                    <input
                        type="text"
                        placeholder="Give your capsule a name"
                        className={styles.inputField}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label className={styles.label}>Description</label>
                    <textarea
                        placeholder="Describe your capsule"
                        className={`${styles.inputField} ${styles.textarea}`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        required
                    />

                    <label className={styles.label}>Select Content Types</label>
                    <div className={styles.contentButtons}>
                        {['Photos', 'Audio', 'Videos', 'Text'].map(item => {
                            const key = item.toLowerCase();
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    className={`${styles.contentButton} ${selectedTypes[key] ? styles.activeContent : ''}`}
                                    onClick={() =>
                                        setSelectedTypes(prev => ({ ...prev, [key]: !prev[key] }))
                                    }
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dynamic sections */}
                    {Object.keys(selectedTypes).map(type => {
                        if (!selectedTypes[type]) return null;

                        if (type === "text") {
                            return (
                                <div key="text-input" className={styles.contentSection}>
                                    <label className={styles.label}>Text Content</label>
                                    <textarea
                                        placeholder="Write something..."
                                        className={`${styles.inputField} ${styles.textarea}`}
                                        value={capsuleContent.text}
                                        onChange={handleTextChange}
                                        rows="5"
                                    />
                                </div>
                            );
                        }

                        return (
                            <div key={type} className={styles.contentSection}>
                                <label className={styles.label}>
                                    Upload {type.charAt(0).toUpperCase() + type.slice(1)}
                                </label>
                                <FileUploader
                                    contentType={type}
                                    onFileChange={(files) => handleFileChange(type, files)}
                                />
                                <p className={styles.fileCount}>
                                    {capsuleContent[type].length} file(s) selected.
                                </p>
                            </div>
                        );
                    })}

                    <label className={styles.label}>Unlock Date & Time</label>
                    <div className={styles.dateInputContainer}>
                        <input
                            type="datetime-local"
                            className={styles.inputField}
                            value={unlockDate}
                            onChange={(e) => setUnlockDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            required
                        />
                        <span className={styles.calendarIcon}>&#x1F4C5;</span>
                    </div>

                    <div className={styles.actionButtons}>
                        <button type="submit" className={styles.saveButton} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Capsule'}
                        </button>
                        <button type="button" className={styles.cancelButton} onClick={() => navigate('/dashboard')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCapsuleForm;
