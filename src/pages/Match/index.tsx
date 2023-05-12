import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {onValue, ref, update} from "firebase/database";
import {db} from "../../firebase/config";
import {Matches, Players} from "../Home";

const MatchPage = () => {
    const [match, setMatch] = useState<Matches>();
    let { matchId } = useParams<{matchId: string}>();

    useEffect(() => {
        const reference = ref(db, 'matches/');
        onValue(reference, snapshot => {
            if (snapshot.exists()) {
                const matchData = snapshot.val()[matchId]
                setMatch(matchData);
            }
        })
    }, [matchId])

    const setPaused = () => {
        let currData = match;
        if (currData) {
            currData.isPaused = !currData.isPaused;

            update(ref(db, 'matches/' + matchId), currData);
        }
    }

    const setViolation = (playerId: number) => {
        let currData = match;

        if (currData) {
            currData.players[playerId].isViolation = !currData.players[playerId].isViolation

            update(ref(db, 'matches/' + matchId), currData);
        }
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='wrapper w-100 h-fit'>
                <div className='title flex justify-center'>{match?.players.length === 2 && (<p className='text-3xl font-bold'>{match.players[0].name} VS {match.players[1].name}</p>)}</div>
                <div className='mediator flex justify-center mt-1'><span>Mediator</span> <span className='rounded-full px-2 ms-2 bg-amber-500'>{match?.mediatorName}</span></div>
                <div className="status flex justify-center mt-1">
                    {match?.status === 1 && (<span className='rounded-full px-2 ms-2 bg-lime-400'>On Going</span>)}
                    {match?.status === 0 && (<span className='rounded-full px-2 ms-2 bg-slate-400'>Finished</span>)}
                </div>
                <div className='option-wrapper mt-5'>
                    <div className="pause-button flex justify-center">
                        <button className='rounded-full w-20 h-20 shadow-md flex justify-center items-center text-lg font-semibold' onClick={setPaused} disabled={match?.status === 0}>{match?.isPaused ? 'Play' : 'Paused'}</button>
                    </div>
                    <div className="player-control flex justify-between mt-5">
                        {match?.players && match.players.map((player: Players, idx: number) => (
                            <div className='w-100 h-100 flex flex-col justify-center items-center shadow-md p-4 rounded-lg' key={idx}>
                                <p className='mb-5 text-lg font-semibold'>{player.name}</p>
                                <button className={(!player.isViolation && match.status !== 0) ? 'text-white rounded-lg p-3 bg-rose-500 hover:bg-rose-400' : 'text-white rounded-lg p-3 bg-rose-200'} disabled={player.isViolation && match.status !== 0} onClick={() => setViolation(idx)}>Penalty</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="back flex justify-center mt-10">
                    <Link to='/'>
                        <button className='rounded-full p-3 shadow-md'>Kembali</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MatchPage;
