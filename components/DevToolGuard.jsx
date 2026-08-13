'use client';

import { useEffect } from 'react';
import disableDevtool from 'disable-devtool';

const DevToolGuard = () => {
    useEffect(() => {
        // This will run only on the client side
        disableDevtool({
            // This is the URL you want to redirect to
            redirect: '/access-denied', 
            // You can add a delay before the redirect happens (in milliseconds)
            timeOut: 100, 
            // This makes the detection more aggressive
            isDevIframe: true, 
            url: "https://whyinspect.netlify.app/",
        });
    }, []);

    return null; // This component doesn't render anything
};

export default DevToolGuard;