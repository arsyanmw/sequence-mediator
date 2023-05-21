import React, {useEffect, useRef} from 'react';
import {FaGrinTongueWink} from "@react-icons/all-files/fa/FaGrinTongueWink";
import './index.css'

const HomePage = () => {
    const elScroll = useRef<HTMLDivElement>(null);

    useEffect(() => {
        elScroll.current?.scrollIntoView({behavior: 'smooth'})
    }, []);

    return (
        <div className='container mx-auto'>
            <div className="homes h-screen w-full flex justify-center items-center flex-col" ref={elScroll}>
                <div><FaGrinTongueWink className="text-3xl" /></div>
                <div className="text-3xl font-bold">HELLO</div>
            </div>
        </div>
    )
};

export default HomePage;
