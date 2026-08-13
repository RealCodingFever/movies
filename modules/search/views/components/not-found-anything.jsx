export default function NotFoundAnything() {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-8 animate-[fadeInUp_0.6s_cubic-bezier(0.4,0,0.2,1)]">
            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInFromBottom {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
            <div className="text-center max-w-[400px]">
                <div className="w-20 h-20 mx-auto mb-6 text-gray-400/60 animate-[float_3s_ease-in-out_infinite]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </div>
                <h2 className="text-white text-2xl font-semibold mb-2 animate-[slideInFromBottom_0.6s_cubic-bezier(0.4,0,0.2,1)_0.2s_both]">Nothing to see</h2>
                <p className="text-gray-400 text-base m-0 leading-relaxed animate-[slideInFromBottom_0.6s_cubic-bezier(0.4,0,0.2,1)_0.4s_both]">
                    Start typing to search for movies and TV shows
                </p>
            </div>
        </div>
    );
}
