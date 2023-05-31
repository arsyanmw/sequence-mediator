import {Players} from "../../interfaces";
import {FaCrown} from "@react-icons/all-files/fa/FaCrown";
import React from "react";

export const WinTag = (players: Players[], winnerId: number | string) => {
    return players?.map((player, idx) => {
        if (winnerId === idx) {
            return <p className='flex justify-center' key={idx}><span className='win-tag px-2 rounded-full bg-lime-400 flex justify-center items-center'><FaCrown className='me-1'/> {player.name}</span> {idx !== players.length - 1 ? <span className='mx-1 italic font-semibold'>VS</span> : ''}</p>;
        } else {
            return <p className='flex justify-center' key={idx}><span className='win-tag flex justify-center'>{player.name}</span> {idx !== players.length - 1 ? <span className='mx-1 italic font-semibold'>VS</span> : ''}</p>;
        }
    });
}
