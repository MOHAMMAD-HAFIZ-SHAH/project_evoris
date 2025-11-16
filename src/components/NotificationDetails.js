import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./NotificationDetails.module.css";

// ✅ FIX: Import default export (not destructured)
import notificationsMockData from "./notificationsData";

const NotificationDetails = () => {
    const { id } = useParams();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const item = notificationsMockData.find((n) => n.id === id);
        setNotification(item);
    }, [id]);

    if (!notification) {
        return (
            <div className={styles.error}>
                Notification not found.
                <br />
                <Link to="/dashboard/notifications" className={styles.backBtn}>
                    ← Back to Notifications
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link to="/dashboard/notifications" className={styles.backBtn}>
                ← Back
            </Link>

            <div className={styles.card}>
                <div
                    className={styles.iconWrapper}
                    style={{ backgroundColor: notification.color }}
                >
                    <span className={styles.icon}>{notification.icon}</span>
                </div>

                <h1 className={styles.title}>{notification.title}</h1>
                <p className={styles.time}>{notification.time}</p>

                <p className={styles.message}>{notification.message}</p>
            </div>
        </div>
    );
};

export default NotificationDetails;
