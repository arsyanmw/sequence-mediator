import React, {useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import './index.css';
import {child, get, onValue, ref, update} from "firebase/database";
import {FaFlag} from "@react-icons/all-files/fa/FaFlag";
import {FaCrown} from "@react-icons/all-files/fa/FaCrown";
import {db} from "../../firebase/config";
import {Colors, Matches, Players, Statuses} from "../../interfaces";

const MatchPage = () => {
    const history = useHistory();
    const [match, setMatch] = useState<Matches>();
    const [colors, setColors] = useState<Colors[]>([]);
    const [showModalCardCheck, setShowModalCardCheck] = useState<boolean>(false);
    const [showModalFinished, setShowModalFinished] = useState<boolean>(false);
    let { matchId } = useParams<{matchId: string}>();

    useEffect(() => {
        onValue(ref(db, 'matches/'), snapshot => {
            if (snapshot.exists()) {
                const matchData: Matches = snapshot.val()[matchId]
                setMatch(matchData);

                const shouldShowModal = matchData.status === Statuses.ongoing && matchData.totalTurnMatch !== 0 && matchData.totalTurnMatch % 10 === 0;
                setShowModalCardCheck(shouldShowModal);
            }
        })
    }, [matchId])

    useEffect(() => {
        get(child(ref(db), 'colors/'))
            .then(colors => setColors(colors.val()));
    }, [])

    const setPaused = () => {
        let currData = match;
        if (currData) {
            currData.isPaused = !currData.isPaused;
            

            if (currData.isPaused) {
                currData.players.map((player, id) => {
                    if (player.onTurn) {
                        if (currData) {
                            currData.lastPlayerRun = id;
                        }
                    }

                    return player.onTurn = false;
                })
            } else {
                currData.players[currData.lastPlayerRun].onTurn = true;
            }

            update(ref(db, 'matches/' + matchId), currData);
        }
    }

    const setViolation = (playerId: number) => {
        let currData = match;
        if (currData) {
            if (currData.players[playerId].time !== 30) {
                currData.players[playerId].time = 30;
            }
            currData.players[playerId].isViolation = !currData.players[playerId].isViolation

            update(ref(db, 'matches/' + matchId), currData);
        }
    }

    const setFinished = (winnerId: number) => {
        let currData = match;
        if (currData?.status === 1) {
            currData.winner = winnerId;
            currData.isPaused = true;
            currData.status = 0;

            update(ref(db, 'matches/' + matchId), currData)
                .then(() => {
                    setShowModalFinished(false);
                    history.push('/');
                });
        }
    }

    const setPlayerColor = (playerColor: string) => {
        return colors.find(color => color.name === playerColor);
    }

    const totalTurn = () => {
        return match?.totalTurnMatch || match?.players?.reduce((acc, currentValue) => {
            return acc + currentValue.totalTurn;
        }, 0);
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='wrapper w-100 h-fit'>
                <div className='title flex justify-center'>{match?.players.length === 2 && (<p className='text-3xl font-bold'>{match.players[0].name} VS {match.players[1].name}</p>)}</div>
                <div className='mediator flex justify-center mt-1'><span>Mediator</span> <span className='rounded-full px-2 ms-2 bg-amber-500'>{match?.mediatorName}</span></div>
                <div className='match-round flex justify-center mt-1 font-bold'>Match - {parseInt(matchId) + 1}</div>
                <div className="status flex justify-center mt-1">
                    {match?.status === 1 && (<span className='rounded-full px-2 ms-2 bg-lime-400 font-bold text-white'>On Going</span>)}
                    {match?.status === 0 && (<span className='rounded-full px-2 ms-2 bg-slate-400 font-bold text-white'>Finished</span>)}
                </div>
                <div className='option-wrapper mt-5'>
                    <div className="pause-button flex justify-center">
                        <button className={`rounded-full w-20 h-20 shadow-md flex justify-center items-center text-lg font-semibold ${match?.status === 0 && ' bg-slate-200 text-slate-500'}`} onClick={setPaused} disabled={match?.status === 0}>{match?.isPaused ? 'Play' : 'Paused'}</button>
                    </div>
                    <div className="total-turn flex justify-center mt-5">
                        <p className='font-bold'>Total Turn : {totalTurn()}</p>
                    </div>
                    <div className="player-control flex justify-between mt-5">
                        {match?.players && match.players.map((player: Players, idx: number) => {
                            return (
                                <div
                                    className='w-100 h-100 flex flex-col justify-center items-center shadow-md p-4 rounded-lg'
                                    key={idx} style={{backgroundColor: `${setPlayerColor(player.color)?.hex}`}}>
                                    <p className='text-lg font-semibold rounded-full bg-white px-2'>{player.name}</p>
                                    <p className='mb-5 text-lg text-white font-semibold'>{player.totalTurn}</p>
                                    <button
                                        className={(!player.isViolation && match.status !== 0) ? 'text-white rounded-lg p-3 bg-rose-500 bg-orange-600 hover:bg-orange-400' : 'text-white rounded-lg p-3 bg-rose-200'}
                                        disabled={player.isViolation && match.status !== 0}
                                        onClick={() => setViolation(idx)}>Penalty
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="buttons flex justify-center">
                    <div className="back flex justify-center mt-10">
                        <Link to='/'>
                            <button className='rounded-full p-3 shadow-md font-bold w-20'>Back</button>
                        </Link>
                    </div>
                    {match?.status === 1 && (
                        <div className="back flex justify-center mt-10 ms-2">
                            <button className='rounded-full p-3 shadow-md bg-lime-400 text-white font-bold flex justify-center items-center' onClick={() => setShowModalFinished(!showModalFinished)}><FaFlag className='me-1' /> Set Finished</button>
                        </div>
                    )}
                </div>
            </div>
            {showModalCardCheck && <Modal type={'card-check'} onOk={() => setShowModalCardCheck(false)} onCancel={() => setShowModalCardCheck(false)} />}
            {showModalFinished && <Modal type={'finished'} onOk={setFinished} onCancel={() => setShowModalFinished(false)} players={match?.players} />}
        </div>
    )
}

const Modal = (props: {type: string, onOk?: any, onCancel: any, players?: Players[]}) => {
    const {type, onOk, onCancel, players} = props;

    const bodyByType = (type: string) => {

        if (type === 'card-check') {
            return (
                <>
                    <span className='text-3xl font-bold'>Card Check!</span>

                    <div className="modal-buttons mt-10">
                        <button className='p-2 w-20 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-bold' onClick={onOk}>OK</button>
                    </div>
                </>
            );
        } else if (type === 'finished') {
            return (
                <>
                    <span className='text-3xl font-bold flex justify-center items-center'>Select The Winner <FaCrown className='ms-2 text-yellow-400' /> </span>

                    <div className="player-button flex justify-around item-center mt-5">
                        {players && players.map((player: Players, idx: number) => {
                            return (
                                <button
                                    className='flex flex-col justify-center items-center shadow-md p-4 rounded-lg'
                                    key={idx}
                                    onClick={() => onOk(idx)}>
                                    <p className='text-lg font-semibold rounded-full bg-white px-2'>{player.name}</p>
                                </button>
                            )
                        })}
                    </div>

                    <div className="modal-buttons mt-10">
                        <button className='p-2 w-20 rounded-lg bg-rose-500 hover:bg-blue-400 text-white font-bold' onClick={onCancel}>Cancel</button>
                    </div>
                </>
            );
        }
    }

    return (
        <div className="modal-wrapper">
            <div className="modal-content w-11/12 md:w-1/4 rounded-lg shadow-lg">
                <div className="modal-body p-5 text-center">
                    {bodyByType(type)}
                </div>
            </div>
        </div>
    )
}

export default MatchPage;
