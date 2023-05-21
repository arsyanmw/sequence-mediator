import React, {useEffect, useState} from 'react';
import {TitlePage} from "../../components";
import {FaPlus} from "@react-icons/all-files/fa/FaPlus";
import {FaPen} from "@react-icons/all-files/fa/FaPen";
import {Challanger} from "../../interfaces";
import {onValue, ref, remove, set} from "firebase/database";
import {db} from "../../firebase/config";
import {FaTrash} from "@react-icons/all-files/fa/FaTrash";
import {FaRegTimesCircle} from "@react-icons/all-files/fa/FaRegTimesCircle";

const PLayersPage = () => {
    const [players, setPlayers] = useState<Challanger[]>([]);
    const [modal, setModal] = useState({type: 'add', show: false, playerName: ''});

    useEffect(() => {
        onValue(ref(db, 'players/'), snapshot => {
            if (snapshot.exists()) {
                setPlayers(snapshot.val());
            }
        })
    }, [])

    const onAddPlayer = (newPlayerName: string, oldPlayerName?: string) => {
        let currPlayers: any[] = players;

        if (oldPlayerName) {
            currPlayers.map((player) => {
                if (player.name === oldPlayerName) {
                    return player.name = newPlayerName;
                }
                return true;
            })
        } else {
            currPlayers.push({name: newPlayerName})
        }

        if (newPlayerName) {
            set(ref(db, 'players/'), currPlayers).then(() => setModal({...modal, show: false}));
        }
    }

    const onDelete = (playerIdx: number) => {
        remove(ref(db, `players/${playerIdx}`));
    }

    return (
        <div className="wrapper">
            <div className='container mx-auto pb-20'>
                <TitlePage title={'Player List'} />

                <div className="player-list">
                    {players.length && players.map((player, idx) => (
                        <div className="wrapper w-full p-4 rounded-lg shadow-md bg-white flex justify-between items-center mb-2" key={idx}>
                            <span className="text-center text-lg font-bold capitalize">{player?.name}</span>
                            <div className="player-option flex justify-center flex-row">
                                <span className="text-center text-lg font-bold shadow-md rounded-full p-2" onClick={() => setModal({type: 'edit', show: true, playerName: player?.name})}><FaPen/></span>
                                <span className="text-center text-lg text-white font-bold shadow-md rounded-full p-2 bg-red-500 ms-2" onClick={() => onDelete(idx)}><FaTrash/></span>
                            </div>
                        </div>
                    ))}
                </div>

                <AddPlayerFAB onPress={() => setModal({type: 'add', show: true, playerName: ''})} />
            </div>

            {modal.show && <ModalAddPlayer onSubmit={onAddPlayer} onClose={() => setModal({...modal, show: false})} modalData={modal} />}
        </div>
    )
};

const AddPlayerFAB = (props: { onPress: any }) => {
    return (
        <div className="fab fixed bottom-4 right-3" onClick={props.onPress}>
            <div className="fab-button rounded-full shadow-xl flex justify-center items-center bg-blue-500 active:bg-blue-300 p-5">
                <FaPlus className="text-white text-lg" />
            </div>
        </div>
    )
}

const ModalAddPlayer = (props: { onSubmit: any, onClose: any, modalData: any }) => {
    const [playerName, setPlayerName] = useState('');
    const [oldPlayerName, setOldPlayerName] = useState('');

    useEffect(() => {
        setPlayerName('');
        setOldPlayerName('');

        if (props.modalData?.playerName) {
            setPlayerName(props.modalData?.playerName);
            setOldPlayerName(props.modalData?.playerName)
        }
    }, [props.modalData.playerName]);

    return (
        <div className="wrapper fixed top-0 right-0 left-0 bottom-0 h-screen w-screen md:w-full bg-slate-500/[.9] z-50 flex justify-center items-center">
            <div className="modal bg-white w-4/6 h-60 rounded-lg shadow-lg flex justify-between items-center flex-col p-5 relative">
                <div className="close-button absolute top-2 right-2" onClick={props.onClose}>
                    <FaRegTimesCircle className="text-2xl" />
                </div>

                <div className="title font-bold text-lg mb-2">
                    <span className="capitalize">{props.modalData.type} Player</span>
                </div>
                <div className="text-input w-full mb-2 flex justify-center items-center">
                    <input type="text" placeholder="Janu Doe" className="w-4/6 p-2 font-semibold border-b-2 outline-0 text-center" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
                </div>
                <div className="button w-full flex justify-center items-center">
                    <button className="bg-blue-500 active:bg-blue-300 p-2 rounded-lg w-4/6">
                        <span className="text-white font-bold" onClick={() => {
                            if (playerName) {
                                props.onSubmit(playerName, oldPlayerName);
                            } else {
                                alert('Input Player Name First!')
                            }
                        }}>Submit</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PLayersPage;
