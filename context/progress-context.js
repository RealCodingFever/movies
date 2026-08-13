'use client';

import React, { createContext, useContext, useCallback } from 'react';

const ProgressContext = createContext(undefined);

export const ProgressProvider = ({ children }) => {
    const getKey = (itemType, itemId, season, episode) => {
        if (itemType === 'movie') {
            return `progress_${itemType}_${itemId}`;
        }
        return `progress_${itemType}_${itemId}_${season}_${episode}`;
    };

    const getProgress = useCallback((itemType, itemId, season, episode) => {
        if (typeof window === 'undefined') return null;
        const key = getKey(itemType, itemId, season, episode);
        const value = localStorage.getItem(key);

        if (value) {
            const [progress, duration] = value.split('_').map(Number);
            return { progress, duration };
        }
        return null;
    }, []);

    const setProgress = useCallback((itemType, itemId, season, episode, progress, duration) => {
        if (typeof window === 'undefined') return;

        const MAX_ITEMS = 1000;
        const key = getKey(itemType, itemId, season, episode);
        const value = `${Math.round(progress)}_${Math.round(duration)}`;
        const queueKey = 'progress_keys_queue';

        try {
            let keysQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
            keysQueue = keysQueue.filter(k => k !== key);
            keysQueue.push(key);

            if (keysQueue.length > MAX_ITEMS) {
                const oldestKey = keysQueue.shift();
                if (oldestKey) localStorage.removeItem(oldestKey);
            }

            localStorage.setItem(key, value);
            localStorage.setItem(queueKey, JSON.stringify(keysQueue));

        } catch (error) {
            console.error("Error managing progress in localStorage:", error);
        }
    }, []);


    return (
        <ProgressContext.Provider value={{
            getProgress,
            setProgress,
        }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};
