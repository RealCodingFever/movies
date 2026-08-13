import './globals.css'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/auth-context';
import { ProgressProvider } from '@/context/progress-context';
import DevToolGuard from '@/components/DevToolGuard';
import Navbar from '@/components/navbar/navbar';
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    display: "swap",
});
import Footer from '@/components/footer';
import DisclaimerPopup from '@/components/disclaimer-popup';
import AnnouncementCard from '@/components/announcement-card/announcement-card';
import { ChatWidget } from '@/movie-chat';

export const metadata = {
    title: {
        default: "AKMovies",
        template: "%s | AKMovies"
    },
    description: "Free movie streaming platform.",
    robots: { index: true, follow: true },
    icons: {
        icon: "/icon.png",
        apple: "/icon.png"
    },
    metadataBase: new URL("https://www.akmovies.in")
};

export const cacheControl = {
    maxAge: 31536000,
    public: true,
};


export default function RootLayout({ children }) {

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
                <link rel="icon" href="/icon.png" type="image/png" sizes="16x16" />
                <link rel="apple-touch-icon" href="/icon.png" />
                <link rel="manifest" href="/manifest-v2.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="theme-color" content="#e94560" />
                <meta name="msapplication-TileColor" content="#e94560" />

                {/* Additional SEO Meta Tags */}
                <meta name="copyright" content="AKMovies" />
                <meta name="language" content="English" />
                <meta name="revisit-after" content="1 days" />
                <meta name="distribution" content="global" />
                <meta name="rating" content="general" />
                <meta name="coverage" content="Worldwide" />
                <meta name="target" content="all" />

                {/* Structured Data for Rich Snippets */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "AKMovies",
                            "url": "https://www.akmovies.in",
                            "alternateName": "AK Movies",
                            "description": "Watch free movies online, stream TV series, and download movies. Free movie streaming platform.",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": "https://www.akmovies.in/search?q={search_term_string}",
                                "query-input": "required name=search_term_string"
                            },
                            "sameAs": [
                                "https://twitter.com/akmovies",
                                "https://facebook.com/akmovies"
                            ]
                        })
                    }}
                />

                {/* Additional Schema for Movie Streaming Service */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "EntertainmentBusiness",
                            "name": "AKMovies",
                            "description": "Free movie streaming platform offering Hollywood, Bollywood, and international films",
                            "url": "https://www.akmovies.in",
                            "telephone": "+91-XXXXXXXXXX",
                            "address": {
                                "@type": "PostalAddress",
                                "addressCountry": "IN"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": "28.6139",
                                "longitude": "77.2090"
                            },
                            "openingHours": "Mo-Su 00:00-23:59",
                            "priceRange": "Free",
                            "currenciesAccepted": "None",
                            "paymentAccepted": "Free"
                        })
                    }}
                />

                {/* Preconnect to external domains for performance */}
                <link rel="preconnect" href="https://image.tmdb.org" />
                <link rel="preconnect" href="https://anilist.co" />
                <link rel="dns-prefetch" href="https://image.tmdb.org" />
                <link rel="dns-prefetch" href="https://anilist.co" />

                {/* GOOGLE ADSENSE */}
                <meta name="google-adsense-account" content="ca-pub-2255279154258731"></meta>
            </head>
            <body className="text-white bg-black" style={{ fontFamily: poppins.style.fontFamily }}>
                <div className="floating-dots">
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                    <div className="floating-dot"></div>
                </div>

                <AuthProvider>
                    <ProgressProvider>
                        <DevToolGuard />
                        <DisclaimerPopup />
                        <AnnouncementCard />
                        <Navbar />
                        {children}
                        <Footer />
                        <Toaster />
                        <ChatWidget />
                    </ProgressProvider>
                </AuthProvider>
            </body>
        </html>
    )
} 
