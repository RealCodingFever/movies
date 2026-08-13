import React from 'react';
import { FaThLarge } from 'react-icons/fa';

const ViewMoreButton = ({ onClick, label = "Want More?" }) => {
    return (
        <div className="flex justify-center mt-12 mb-8">
            <button
                onClick={onClick}
                className="group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95"
            >
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="inset-0 absolute pointer-events-none select-none">
                        <div
                            className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
                            style={{
                                background: 'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))',
                                animation: 'border-glow-translate 10s ease-in-out infinite alternate'
                            }}
                        ></div>
                    </div>
                </div>

                <div
                    className="inset-0 absolute pointer-events-none select-none"
                >
                    <div
                        className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full"
                        style={{
                            background: 'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))',
                            animation: 'border-glow-scale 10s ease-in-out infinite alternate'
                        }}
                    ></div>
                </div>

                <div
                    className="flex items-center justify-center gap-2 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-3 px-8 pl-6 w-full"
                >
                    <div
                        className="relative transition-transform duration-500 group-hover:rotate-[360deg]"
                    >
                        <FaThLarge className="text-[#ea4c89] text-lg opacity-80 dark:opacity-100" />
                        <div
                            className="rounded-full size-8 absolute opacity-0 dark:opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-lg"
                            style={{
                                background: 'linear-gradient(135deg, rgb(59, 196, 242), rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))',
                                animation: 'star-shine 14s ease-in-out infinite alternate'
                            }}
                        ></div>
                    </div>
                    <span
                        className="bg-gradient-to-b ml-1 dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-sm font-bold tracking-wide text-transparent group-hover:scale-105 transition transform-gpu uppercase"
                    >
                        {label}
                    </span>
                </div>
            </button>

            <style jsx>{`
                @keyframes border-glow-translate {
                    0% { transform: translateX(-50%) translateY(-33%); }
                    100% { transform: translateX(50%) translateY(33%); }
                }
                @keyframes border-glow-scale {
                    0% { transform: translateX(-50%) scaleY(1); }
                    50% { transform: translateX(-50%) scaleY(1.5); }
                    100% { transform: translateX(-50%) scaleY(1); }
                }
                @keyframes star-shine {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `}</style>
        </div>
    );
};

export default ViewMoreButton;
