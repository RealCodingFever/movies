'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.css';

const ANNOUNCEMENT_VERSION = "v5"; // bumped for akgenie launch
const STORAGE_KEY = `announcement_${ANNOUNCEMENT_VERSION}_dismissed`;

export default function AnnouncementCard() {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState({ left: false, right: false });

    useEffect(() => {
        // Check local storage
        if (localStorage.getItem(STORAGE_KEY)) {
            return;
        }

        // Preload megaphone images
        const leftImg = new Image();
        const rightImg = new Image();

        let leftLoaded = false;
        let rightLoaded = false;

        const checkAllLoaded = () => {
            if (leftLoaded && rightLoaded) {
                // Small delay before showing to allow animation to feel fresh
                setTimeout(() => {
                    setIsVisible(true);
                }, 500);
            }
        };

        leftImg.onload = () => {
            leftLoaded = true;
            setImagesLoaded(prev => ({ ...prev, left: true }));
            checkAllLoaded();
        };

        rightImg.onload = () => {
            rightLoaded = true;
            setImagesLoaded(prev => ({ ...prev, right: true }));
            checkAllLoaded();
        };

        // Handle image load errors - show popup anyway after timeout
        const errorTimeout = setTimeout(() => {
            if (!leftLoaded || !rightLoaded) {
                setImagesLoaded({ left: true, right: true });
                setTimeout(() => {
                    setIsVisible(true);
                }, 500);
            }
        }, 3000); // 3 second fallback timeout

        // Start loading images
        leftImg.src = '/megaphone.png';
        rightImg.src = '/megaphone.png';

        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsButtonEnabled(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isVisible]);

    const handleDismiss = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.wrapper}>

                {/* Left Megaphone */}
                <div className={`${styles.megaphoneWrapper} ${styles.left}`}>
                    <img src="/megaphone.png" alt="Megaphone" className={styles.megaphone} />
                </div>

                {/* The Tilted Pink Background */}
                <div className={styles.tiltedBackground}></div>

                {/* The Main Dark Card */}
                <div className={styles.card}>

                    {/* Ribbon Header */}
                    <div className={styles.ribbonContainer}>
                        <div className={styles.ribbon}>
                            <span className={styles.ribbonText}>NEW FEATURE</span>
                            <div className={styles.exSignWrapper}>
                                <img src="/exSign.png" alt="!" className={styles.exSign} />
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className={styles.body}>
                        <p className={styles.message}>
                            Meet <strong>akgenie</strong>! 🧞‍♂️ Our brand new AI assistant is now live to grant all your movie & series wishes. Try it out now!
                        </p>
                    </div>

                    {/* Footer with Separator Line */}
                    <div className={styles.footer}>
                        <button
                            className={`${styles.dismissButton} ${isButtonEnabled ? styles.enabled : styles.disabled}`}
                            onClick={handleDismiss}
                            disabled={!isButtonEnabled}
                        >
                            {isButtonEnabled ? 'Dismiss' : `Dismiss (${timeLeft}s)`}
                        </button>
                    </div>
                </div>

                {/* Right Megaphone */}
                <div className={`${styles.megaphoneWrapper} ${styles.right}`}>
                    <img src="/megaphone.png" alt="Megaphone" className={styles.megaphone} />
                </div>
            </div>
        </div>
    );
}