import React from 'react';

const TestPage = () => {
    // Example URL - user can replace this
    // const src = "https://vidsrc.cc/v2/embed/movie/1168190";
    const src = "https://vidsrc.wtf/api/1/movie/?id=1084242&color=e01621";

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <h1 className="text-2xl mb-4 font-bold">Sandbox Iframe Test</h1>
            <div className="w-full max-w-4xl aspect-video border border-gray-700 bg-black rounded-lg overflow-hidden relative">
                <iframe
                    src={src}
                    className="w-full h-full absolute inset-0"
                    frameBorder="0"
                    allowFullScreen
                    // sandbox attributes:
                    // allow-forms: allows form submission
                    // allow-scripts: allows JavaScript
                    // allow-same-origin: allows the content to be treated as being from its normal origin
                    // allow-presentation: allows the iframe to enter fullscreen
                    // CRITICAL: Omitted 'allow-popups' and 'allow-popups-to-escape-sandbox' to block ads
                    sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
                    title="Sandboxed Content"
                    allow="autoplay; encrypted-media"
                />
            </div>
            <p className="mt-4 text-gray-400 text-sm">
                This iframe has <code>allow-popups</code> disabled to prevent popup ads.
            </p>
        </div>
    );
};

export default TestPage;
