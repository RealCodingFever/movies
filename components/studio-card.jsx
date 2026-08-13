'use client';

import Link from 'next/link';
import Image from 'next/image';

const StudioCard = ({ studio }) => {
    // Handle streaming platforms differently
    if (studio.isStreaming) {
        return (
            <div className="flex-[0_0_350px] pt-2 pb-2 md:flex-[0_0_280px] sm:flex-[0_0_250px]">
                <Link
                    href={`/streaming/${studio.id}`}
                    className="block relative h-[200px] border-2 border-white/10 rounded-2xl overflow-hidden transition-transform duration-300 bg-gradient-to-t from-black/80 via-transparent to-transparent shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] group hover:-translate-y-1 hover:border-[#e94560] hover:shadow-[0_12px_40px_rgba(233,69,96,0.3)] md:h-[160px] sm:h-[140px]"
                >
                    <Image
                        src={studio.imagePath}
                        alt={studio.name}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="300px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(233,69,96,0.1),rgba(255,107,107,0.1))] opacity-0 transition-opacity duration-400 z-[1] group-hover:opacity-100"></div>
                </Link>
            </div>
        );
    }

    // Handle regular studios (existing logic)
    const formattedName = studio.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const studioUrl = `/studio/${studio.id}-${formattedName}`;

    return (
        <div className="flex-[0_0_350px] pt-2 pb-2 md:flex-[0_0_280px] sm:flex-[0_0_250px]">
            <Link
                href={studioUrl}
                className="block relative h-[200px] border-2 border-white/10 rounded-2xl overflow-hidden transition-transform duration-300 bg-gradient-to-t from-black/80 via-transparent to-transparent shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] group hover:-translate-y-1 hover:border-[#e94560] hover:shadow-[0_12px_40px_rgba(233,69,96,0.3)] md:h-[160px] sm:h-[140px]"
            >
                <Image
                    src={studio.imagePath}
                    alt={studio.name}
                    fill
                    className="object-cover rounded-2xl"
                    sizes="300px"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(233,69,96,0.1),rgba(255,107,107,0.1))] opacity-0 transition-opacity duration-400 z-[1] group-hover:opacity-100"></div>
            </Link>
        </div>
    );
};

export default StudioCard;
