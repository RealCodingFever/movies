'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../not-found.module.css';
// testTMDBConnection removed - using proxy API now

export default function RestrictionPage() {
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Connection check removed - using proxy API now
        setIsChecking(false);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.art} aria-hidden="true">
                <div className={styles.ghost}>
                    <div className={styles.face}>
                        <span className={styles.eye}></span>
                        <span className={styles.eye}></span>
                        <span className={styles.mouth}></span>
                    </div>
                </div>
                <div className={styles.shadow}></div>
            </div>

            <h1 className={styles.title}>451</h1>
            <p className={styles.subtitle}>JIO Restriction</p>
            <p className={styles.description}>
                {isChecking
                    ? 'Checking network connection...'
                    : 'Content is unavailable on this network. Please try connecting to a different Wi-Fi or mobile network to access this service.'}
            </p>
        </div>
    );
}


