// components/Notifications.js

import React from "react";
import { Link } from "react-router-dom";

// ✅ FIX: Import default export (NOT destructured)
import notificationsMockData from "./notificationsData";

import styles from "./Notifications.module.css";

const Notifications = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Notifications</h1>

            <div className={styles.card}>
                {notificationsMockData.map((note) => (
                    <Link
                        key={note.id}
                        to={`/dashboard/notifications/${note.id}`}
                        className={styles.item}
                        style={{ textDecoration: "none" }}   // Remove underline
                    >
                        <div className={styles.left}>
                            <span
                                className={styles.dot}
                                style={{ color: note.color }}
                            >
                                {note.icon}
                            </span>

                            <div className={styles.info}>
                                <p className={styles.title}>{note.title}</p>
                                <p className={styles.time}>{note.time}</p>
                            </div>
                        </div>

                        <div className={styles.arrow}>›</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
