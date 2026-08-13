// hooks/use-install-prompt.js
'use client';
import { useState, useEffect } from 'react';

// Module-level variable to store the event globally
let deferredPrompt = null;

export const useInstallPrompt = () => {
    const [installPrompt, setInstallPrompt] = useState(deferredPrompt);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            // Update state to trigger re-render
            setInstallPrompt(e);
            console.log("PWA Install Prompt captured");
        };

        // If the event already fired before this component mounted, set it from the global variable
        if (deferredPrompt) {
            setInstallPrompt(deferredPrompt);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        // Show the install prompt
        installPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await installPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
        setInstallPrompt(null);
    };

    return { installPrompt, handleInstallClick };
};
