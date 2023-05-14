import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onValue, ref, remove } from 'firebase/database';
import { db } from '../../firebase/config';
import {FaCrown} from "@react-icons/all-files/fa/FaCrown";
import {FaTrash} from "@react-icons/all-files/fa/FaTrash";
import {Matches, Players} from "../../interfaces";

const HomePage = () => {
    const [matches, setMatches] = useState<Matches[]>([]);

    useEffect(() => {
        const reference = ref(db, 'matches/');

        onValue(reference, snapshot => {
            if (snapshot.exists()) {
                setMatches(snapshot.val());
            }
        })
    }, []);

    const WinTag = (players: Players[], winnerId: number) => {
        return players?.map((player, idx) => {
            if (winnerId === idx) {
                return <p className='flex justify-center' key={idx}><span className='win-tag px-2 rounded-full bg-lime-400 flex justify-center items-center'><FaCrown className='me-1'/> {player.name}</span> {idx === 0 ? <span className='mx-1'>VS</span> : ''}</p>;
            } else {
                return <p className='flex justify-center' key={idx}><span className='win-tag flex justify-center'>{player.name}</span> {idx === 0 ? <span className='mx-1'>VS</span> : ''}</p>;
            }
        });
    }

    const onDelete = (matchId: number) => {
        remove(ref(db, 'matches/' + matchId));
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='wrapper'>
                <div className='list'>
                    {matches && matches.map((match: Matches, idx: number) => {
                        return (
                            <div className='flex justify-between items-center mb-5'>
                                <Link to={`/match/${idx}`} key={idx} className='w-full'>
                                    <div className='card-list p-3 w-100 flex justify-between items-center flex-row rounded-lg shadow-md'>
                                        <p>Match-{idx + 1} <span className={'px-2 rounded-full text-xs ' + (match?.status === 1 ? 'bg-lime-400' : 'bg-slate-400')}>{ match?.status === 1 ? 'On Going' : 'Finished' }</span></p>
                                        <div className='flex justify-center items-center'>{WinTag(match.players, match.winner)}</div>
                                    </div>
                                </Link>
                                <span className='ms-2 hover:cursor-pointer' onClick={() => onDelete(idx)}><FaTrash className='text-rose-700' /></span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
};

export default HomePage;
