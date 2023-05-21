import React, {useEffect, useRef, useState} from "react";
import {onValue, ref, remove} from "firebase/database";
import {Link} from "react-router-dom";
import {FaTrash} from "@react-icons/all-files/fa/FaTrash";
import {Matches} from "../../interfaces";
import {TitlePage, WinTag} from "../../components";
import {GiWhirlwind} from "@react-icons/all-files/gi/GiWhirlwind";

import {db} from "../../firebase/config";

const FreeMatchPage = () => {
    const [matches, setMatches] = useState<Matches[]>([]);
    const elScrollDown = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const reference = ref(db, 'matches/');

        onValue(reference, snapshot => {
            if (snapshot.exists()) {
                setMatches(snapshot.val());
            }
        })
    }, []);

    useEffect(() => {
        if (!matches.length) {
            elScrollDown?.current?.scrollIntoView({behavior: 'smooth'})
        }
    }, [matches])

    const onDelete = (matchId: number) => {
        remove(ref(db, 'matches/' + matchId))
            .then(() => window.location.reload());
    }

    return (
        <div className='container mx-auto list'>
            <TitlePage title={"Free Matches"} />

            {matches.length ? matches.map((match: Matches, idx: number) => (
                    <div className='flex justify-between items-center mb-5' key={idx}>
                        <Link to={`/match/${idx}`} className='w-full'>
                            <div className='card-list p-3 w-100 flex justify-between items-center flex-row rounded-lg shadow-md'>
                                <p>Match-{idx + 1} <span className={'px-2 rounded-full text-xs ' + (match?.status === 1 ? 'bg-lime-400' : 'bg-slate-400')}>{ match?.status === 1 ? 'On Going' : 'Finished' }</span></p>
                                <div className='flex justify-center items-center'>{WinTag(match.players, match.winner)}</div>
                            </div>
                        </Link>
                        <span className='ms-2 hover:cursor-pointer' onClick={() => onDelete(idx)}><FaTrash className='text-rose-700' /></span>
                    </div>
                )
            ) : (
                <div className="empty-data h-screen w-full flex justify-center items-center flex-col text-slate-400 font-bold" ref={elScrollDown}>
                    <div className="icon text-3xl"><GiWhirlwind className="animate-pulse" /></div>
                    <div className="text text-xl">No Free Matches Found.</div>
                </div>
            )}
        </div>
    )
}

export default FreeMatchPage;
