import React, {useEffect, useState} from "react";
import {onValue, ref, remove} from "firebase/database";
import {Link} from "react-router-dom";
import {FaTrash} from "@react-icons/all-files/fa/FaTrash";
import {Matches, Tournament} from "../../interfaces";
import {Accordion, AccordionItem} from "@szhsin/react-accordion";
import './index.css';

import {db} from "../../firebase/config";

import {TitlePage, WinTag} from "../../components";

const TournamentPage = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);

    useEffect(() => {
        const reference = ref(db, 'matches/tournament/');

        onValue(reference, snapshot => {
            if (snapshot.exists()) {
                setTournaments(snapshot.val());
            }
        })
    }, []);

    const onDelete = (tournamentIdx: number, matchIdx: number) => {
        remove(ref(db, `matches/tournament/${tournamentIdx}/matches/${matchIdx}`));
    }

    return (
        <div className='container mx-auto list pb-5'>
            <TitlePage title={"Tournament's"} />

            <Accordion>
                {tournaments && tournaments.map((tournament: Tournament, tournamentIdx: number) => {
                    return (
                        <AccordionItem key={tournamentIdx} header={
                            <div className='accord-header p-2 text-black font-bold w-full border-b-2'>
                                {tournament.name}
                            </div>
                        } className='border-2 mb-2 w-full rounded-lg' initialEntered={tournaments.length - 1 === tournamentIdx}>
                            {tournament.matches && tournament.matches.map((match: Matches, matchIdx: number) => {
                                return (
                                    <div className='flex justify-between items-center mb-5 px-2' key={matchIdx}>
                                        <Link to={`/match/tournament/${matchIdx}/${tournamentIdx}`} key={matchIdx} className='w-full'>
                                            <div className='card-list p-3 w-100 flex justify-between items-center flex-row rounded-lg shadow-md'>
                                                <p className='flex flex-col md:flex-row items-center'>Match-{matchIdx + 1} <span className={'md:ms-1 px-2 rounded-full text-xs ' + (match?.status === 1 ? 'bg-lime-400' : 'bg-slate-400')}>{ match?.status === 1 ? 'On Going' : 'Finished' }</span></p>
                                                <div className='flex justify-center items-center'>{WinTag(match.players, match.winner)}</div>
                                            </div>
                                        </Link>
                                        <span className='ms-2 hover:cursor-pointer rounded-full shadow-lg p-2 bg-red-500' onClick={() => onDelete(tournamentIdx, matchIdx)}><FaTrash className='text-white text-lg' /></span>
                                    </div>
                                )
                            })}
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}

export default TournamentPage;
