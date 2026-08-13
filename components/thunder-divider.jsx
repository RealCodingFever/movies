'use client';

import { useRouter } from 'next/navigation';

const ThunderDivider = () => {
    const router = useRouter();

    const handleSurpriseMe = () => {
        router.push('/explore');
    };

    const handleExploreMore = () => {
        router.push('/findbest');
    };

    return (
        <div className="w-full relative flex gap-12 mb-8 bg-[#111] md:flex-col md:gap-4 sm:gap-4">
            <div
                className="w-1/2 h-[22rem] cursor-pointer rounded-[20px] overflow-hidden relative border-2 border-black transition-transform duration-300 bg-gradient-to-t from-black/80 via-transparent to-transparent shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] bg-[url('/home_section_1.png')] bg-cover bg-left bg-no-repeat group hover:-translate-y-1 hover:border-[#e94560] hover:shadow-[0_12px_40px_rgba(233,69,96,0.3)] lg:h-[18rem] md:w-full md:h-[22rem] sm:h-[15rem] xs:h-[12rem]"
                onClick={handleSurpriseMe}
            >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(233,69,96,0.1),rgba(255,107,107,0.1))] opacity-0 transition-opacity duration-400 z-[1] group-hover:opacity-100"></div>
            </div>
            <div
                className="w-1/2 h-[22rem] cursor-pointer rounded-[20px] overflow-hidden relative border-2 border-black transition-transform duration-300 bg-gradient-to-t from-black/80 via-transparent to-transparent shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] bg-[url('/home_section_2.png')] bg-cover bg-left bg-no-repeat group hover:-translate-y-1 hover:border-[#e94560] hover:shadow-[0_12px_40px_rgba(233,69,96,0.3)] lg:h-[18rem] md:w-full md:h-[22rem] sm:h-[15rem] xs:h-[12rem]"
                onClick={handleExploreMore}
            >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(233,69,96,0.1),rgba(255,107,107,0.1))] opacity-0 transition-opacity duration-400 z-[1] group-hover:opacity-100"></div>
            </div>
        </div>
    );
};

export default ThunderDivider;
