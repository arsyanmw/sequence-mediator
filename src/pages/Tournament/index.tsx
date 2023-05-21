import React, {useEffect, useState} from "react";
import {onValue, ref, remove, set, update} from "firebase/database";
import {Link} from "react-router-dom";
import {FaTrash} from "@react-icons/all-files/fa/FaTrash";
import {Matches, Statuses, Tournament} from "../../interfaces";
import {Accordion, AccordionItem} from "@szhsin/react-accordion";
import {TitlePage, WinTag} from "../../components";
import {FaPlus} from "@react-icons/all-files/fa/FaPlus";
import {FaRegTimesCircle} from "@react-icons/all-files/fa/FaRegTimesCircle";
import {tournamentStatuses} from "../../helpers";
import moment from "moment";
import './index.css';

import {db} from "../../firebase/config";

const TournamentPage = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [modal, setModal] = useState({type: 'add', show: false, buttonDisabled: false, data: null});

    useEffect(() => {
        const reference = ref(db, 'matches/tournament/');

        onValue(reference, snapshot => {
            if (snapshot.exists()) {
                setTournaments(snapshot.val());
            }
        })
    }, []);

    const onDeleteMatch = (tournamentIdx: number, matchIdx: number) => {
        remove(ref(db, `matches/tournament/${tournamentIdx}/matches/${matchIdx}`));
    }

    const onCreateTournament = (form: {name: string, startAt: string}) => {
        setModal({...modal, buttonDisabled: true});
        let currTournaments: any[] = tournaments;

        const newTournament: Tournament = {
            name: form.name,
            startAt: moment(form.startAt).format('DD/MM/YYYY HH:mm:ss'),
            endAt: '',
            createdAt: moment().format('DD/MM/YYYY HH:mm:ss'),
            status: 2,
            matches: []
        };

        currTournaments.push(newTournament);

        set(ref(db, 'matches/tournament'), currTournaments).then(() => setModal({...modal, show: false, buttonDisabled: false}));
    }

    const onDeleteTournament = (tournamentId: number) => {
        remove(ref(db, `matches/tournament/${tournamentId}`))
    }

    const onChangeStatusTournament = (tournamentIdx: number, tournamentData: Tournament, status: Statuses) => {
        let currData = tournamentData;

        if (status === Statuses.ongoing && currData.status === Statuses.notstarted && !currData.endAt) {
            currData.status = Statuses.ongoing;

            update(ref(db, `matches/tournament/${tournamentIdx}`), currData);
        } else if (status === Statuses.finished && currData.status === Statuses.ongoing && !currData.endAt) {
            currData.status = Statuses.finished;
            currData.endAt = moment().format('DD/MM/YYYY HH:mm:ss');

            update(ref(db, `matches/tournament/${tournamentIdx}`), currData);
        }
    }

    return (
        <div className='container mx-auto list pb-20'>
            <TitlePage title={"Tournament's"} />

            <Accordion>
                {tournaments && tournaments.map((tournament: Tournament, tournamentIdx: number) => {
                    return (
                        <AccordionItem key={tournamentIdx} header={
                            <div className='accord-header p-2 text-black font-bold w-full border-b-2'>
                                {tournament.name}
                            </div>
                        } className='border-2 mb-2 w-full rounded-lg' initialEntered={tournaments.length - 1 === tournamentIdx}>
                            <div className="tournament-desc w-full flex justify-between items-center p-2 mb-3">
                                <span className="statuses font-bold"><span className={"rounded-full px-2 ms-2 text-white" + (tournament.status === Statuses.ongoing ? " bg-lime-400" : " bg-slate-400")}>{tournamentStatuses(tournament.status)}</span></span>
                                <span className="date font-bold text-right max-w-[40%]">{moment(tournament.createdAt, 'DD/MM/YYYY HH:mm:ss').format('LLLL')}</span>
                            </div>
                            {tournament.status === Statuses.notstarted && (
                                <div className="tournament-options w-full flex justify-center items-center p-2 mb-3">
                                    <button className="p-2 rounded-full shadow-lg bg-blue-400 text-white font-bold" onClick={() => onChangeStatusTournament(tournamentIdx, tournament, Statuses.ongoing)}>Start Tournament</button>
                                    <button className="ms-2 p-2 rounded-full shadow-lg bg-red-400 text-white font-bold" onClick={() => onDeleteTournament(tournamentIdx)}>Delete Tournament</button>
                                </div>
                            )}
                            {tournament.status === Statuses.ongoing && (
                                <div className="tournament-options w-full flex justify-center items-center p-2 mb-3">
                                    <button className="p-2 rounded-full shadow-lg bg-orange-400 text-white font-bold" onClick={() => onChangeStatusTournament(tournamentIdx, tournament, Statuses.finished)}>End Tournament</button>
                                </div>
                            )}
                            {tournament.matches && tournament.matches.map((match: Matches, matchIdx: number) => {
                                return (
                                    <div className='flex justify-between items-center mb-5 px-2' key={matchIdx}>
                                        <Link to={`/match/tournament/${matchIdx}/${tournamentIdx}`} key={matchIdx} className='w-full'>
                                            <div className='card-list p-3 w-100 flex justify-between items-center flex-row rounded-lg shadow-md'>
                                                <p className='flex flex-col md:flex-row items-center'>Match-{matchIdx + 1} <span className={'md:ms-1 px-2 rounded-full text-xs ' + (match?.status === 1 ? 'bg-lime-400' : 'bg-slate-400')}>{ match?.status === 1 ? 'On Going' : 'Finished' }</span></p>
                                                <div className='flex justify-center items-center'>{WinTag(match.players, match.winner)}</div>
                                            </div>
                                        </Link>
                                        <span className='ms-2 hover:cursor-pointer rounded-full shadow-lg p-2 bg-red-500' onClick={() => onDeleteMatch(tournamentIdx, matchIdx)}><FaTrash className='text-white text-lg' /></span>
                                    </div>
                                )
                            })}
                        </AccordionItem>
                    )
                })}
            </Accordion>

            <AddTournamentFAB onPress={() => setModal({type: 'add', show: true, buttonDisabled: false, data: null})} />
            {modal.show && <ModalAddPlayer onSubmit={onCreateTournament} onClose={() => setModal({...modal, show: false})} modalData={modal} />}
        </div>
    )
}

const AddTournamentFAB = (props: { onPress: any }) => {
    return (
        <div className="fab fixed bottom-4 right-3 cursor-pointer" onClick={props.onPress}>
            <div className="fab-button rounded-full shadow-xl flex justify-center items-center bg-blue-500 active:bg-blue-300 p-5">
                <FaPlus className="text-white text-lg" />
            </div>
        </div>
    )
}

const ModalAddPlayer = (props: { onSubmit: any, onClose: any, modalData: any }) => {
    const [form, setForm] = useState({name: '', startAt: ''});

    useEffect(() => {
        setForm({name: '', startAt: ''});
    }, []);

    const onChangeInput = (key: string, value: string) => {
        setForm({
            ...form,
            [key]: value
        })
    }

    return (
        <div className="wrapper fixed top-0 right-0 left-0 bottom-0 h-screen w-screen md:w-full bg-slate-500/[.9] z-50 flex justify-center items-center">
            <div className="modal bg-white w-4/6 md:w-[20rem] h-60 rounded-lg shadow-lg flex justify-between items-center flex-col p-5 relative">
                <div className="close-button absolute top-2 right-2 cursor-pointer" onClick={props.onClose}>
                    <FaRegTimesCircle className="text-2xl" />
                </div>

                <div className="title font-bold text-lg text-center mb-2">
                    <span className="capitalize">{props.modalData.type === 'add' && 'create'} New Tournament</span>
                </div>
                <div className="text-input w-full mb-2 flex justify-center items-center">
                    <input type="text" placeholder="Title" className="w-4/6 p-2 font-semibold border-b-2 outline-0 text-center" value={form.name} onChange={(e) => onChangeInput('name', e.target.value)} />
                </div>
                <div className="text-input w-full mb-2 flex justify-center items-center">
                    <input type="datetime-local" placeholder="Start At" className="w-4/6 p-2 font-semibold border-b-2 outline-0 text-center" value={form.startAt} onChange={(e) => onChangeInput('startAt', e.target.value)}  />
                </div>
                <div className="button w-full flex justify-center items-center">
                    <button className={"active:bg-blue-300 p-2 rounded-lg w-4/6 cursor-pointer" + (props.modalData.buttonDisabled ? " bg-blue-300" : " bg-blue-500")} onClick={() => {
                        if (form.name === '') {
                            alert('Input Title!!');
                        } else if (form.startAt === '') {
                            alert('Input Start Date!!');
                        } else {
                            props.onSubmit(form);
                        }
                    }}>
                        <span className="text-white font-bold">Submit</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TournamentPage;
