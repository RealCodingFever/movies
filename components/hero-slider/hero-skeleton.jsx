const HeroSkeleton = () => {
    return (
        <div className="relative w-full h-screen min-h-[500px] overflow-hidden bg-black lg:min-h-[500px] md:min-h-[500px] sm:min-h-[400px]">
            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
            <div className="absolute top-0 left-0 w-full h-full z-[1] bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_25%,rgba(40,40,40,0.6)_50%,rgba(0,0,0,0.6)_75%)] bg-[size:200%_100%] animate-shimmer"></div>
            <div className="main-container relative w-full h-full z-[2] flex flex-col justify-center items-start">
                <div className="flex flex-col items-start justify-center w-full h-full z-[2] lg:left-[60px] lg:bottom-[100px] lg:max-w-[500px] md:left-[40px] md:bottom-[80px] md:max-w-[400px] sm:left-[20px] sm:bottom-[60px] sm:max-w-[calc(100%-40px)]">
                    <div className="w-[400px] h-[30px] rounded-lg mb-5 bg-[linear-gradient(90deg,rgba(20,20,20,0.6)_25%,rgba(80,80,80,0.6)_50%,rgba(20,20,20,0.6)_75%)] bg-[size:200%_100%] animate-shimmer lg:w-[350px] lg:h-[50px] md:w-[300px] md:h-[40px] sm:w-[250px] sm:h-[35px]"></div>
                    <div className="w-[500px] h-[80px] rounded-md mb-[30px] bg-[linear-gradient(90deg,rgba(20,20,20,0.6)_25%,rgba(80,80,80,0.6)_50%,rgba(20,20,20,0.6)_75%)] bg-[size:200%_100%] animate-shimmer lg:w-[450px] lg:h-[70px] md:w-[350px] md:h-[60px] sm:w-[280px] sm:h-[50px]"></div>
                    <div className="flex gap-5 sm:flex-col sm:gap-2.5">
                        <div className="w-[140px] h-[40px] rounded-[25px] bg-[linear-gradient(90deg,rgba(233,69,96,0.5)_25%,rgba(233,69,96,0.8)_50%,rgba(233,69,96,0.5)_75%)] bg-[size:200%_100%] animate-shimmer md:w-[120px] md:h-[45px] sm:w-[200px] sm:h-[40px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSkeleton;