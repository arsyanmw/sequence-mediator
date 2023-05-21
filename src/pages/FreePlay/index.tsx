import React, {useEffect, useState} from "react";
import {onValue, ref, remove} from "firebase/database";
import {Link} from "react-router-dom";
import {FaTrash} from "@react-icons/all-files/fa/FaTrash";
import {Matches} from "../../interfaces";
import {db} from "../../firebase/config";

import {TitlePage, WinTag} from "../../components";

const FreePlayPage = () => {
    const [matches, setMatches] = useState<Matches[]>([]);

    useEffect(() => {
        const reference = ref(db, 'matches/');

        onValue(reference, snapshot => {
            if (snapshot.exists()) {
                setMatches(snapshot.val());
            }
        })
    }, []);

    const onDelete = (matchId: number) => {
        remove(ref(db, 'matches/' + matchId))
            .then(() => window.location.reload());
    }

    return (
        <div className='container mx-auto list'>
            <TitlePage title={"Free Play's"} />

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
                <div className="h-full w-full flex justify-center items-center">No Matches Found</div>
            )}
        </div>
    )
}

export default FreePlayPage;
