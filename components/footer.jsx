"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <>
            <style jsx>{`
                @keyframes floatSanta {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(2deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float-santa {
                    animation: floatSanta 6s ease-in-out infinite;
                }
            `}</style>

            <footer className="relative pb-12 mt-auto text-center overflow-hidden md:pb-10">

                {/* --- EXISTING CONTENT (Wrapped to sit on top) --- */}
                <div className="main-container relative z-10 w-full max-w-[1200px] mx-auto px-4">
                    {/* Red horizontal line with play button */}
                    <div className="relative mb-8 flex items-center justify-center">
                        {/* Left fading line */}
                        <div className="h-[2px] bg-gradient-to-r from-transparent to-[#e94560] w-1/2 max-w-[700px]"></div>

                        {/* Center play button */}
                        <div className="w-[350px] md:w-[200px] flex items-center justify-center mx-5 z-[2] mb-4">
                            <Image src="/logo.png" alt="AKMovies" width={200} height={60} className="object-contain" />
                        </div>

                        {/* Right fading line */}
                        <div className="h-[2px] bg-gradient-to-l from-transparent to-[#e94560] w-1/2 max-w-[700px]"></div>
                    </div>

                    {/* Main description */}
                    <div className="text-[#c0c0c0] text-[16px] leading-[1.6] max-w-[800px] mx-auto mb-4 px-4 sm:text-[14px] sm:px-2">
                        Enjoy the best movies and TV shows with us!
                    </div>

                    {/* Footer links and copyright */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 border-t border-white/5 pt-8">
                        {/* Copyright */}
                        <div className="text-[#9ca3af] text-[14px]">
                            © 2025 AKMovies. All rights reserved.
                        </div>

                        {/* Disclaimer */}
                        <div className="text-[#9ca3af] text-[12px] text-center md:flex-1 md:px-8 max-w-[600px]">
                            This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
                        </div>

                        {/* Links */}
                        <div className="flex gap-6">
                            <div><Link href="/terms" className="text-[#9ca3af] no-underline text-[14px] transition-colors duration-300 hover:text-[#e94560]">Terms of Service</Link></div>
                            <div><Link href="/dmca" className="text-[#9ca3af] no-underline text-[14px] transition-colors duration-300 hover:text-[#e94560]">DMCA</Link></div>
                            <div><Link href="/privacy" className="text-[#9ca3af] no-underline text-[14px] transition-colors duration-300 hover:text-[#e94560]">Privacy Policy</Link></div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
