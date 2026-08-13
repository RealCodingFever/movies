import React from 'react'

export default function Topbar({ name }) {
    return (
        <div className="bg-top bg-no-repeat bg-cover mb-8 pt-16 pb-8 relative text-center" style={{ backgroundImage: `url(/bg.jpg)` }} >
            <h1 className="mt-32 text-[1.8rem] font-bold text-white mb-20 text-center">{name}</h1>
            <div className="absolute w-full h-full bottom-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        </div>
    )
}
