import React, {useEffect, useState} from "react";
import {ref, remove} from "firebase/database";
import {Link} from "react-router-dom";
import {FaTrash} from "@react-icons/all-files/fa/FaTrash";
import {Histories, Matches} from "../../interfaces";
import {Accordion, AccordionItem} from "@szhsin/react-accordion";
import './tabTwo.css';

import {db} from "../../firebase/config";

import {WinTag} from "..//index";

export const TabTwo = (props: { historiesData: Histories[] }) => {
    const [histories, setHistories] = useState<Histories[]>([]);

    useEffect(() => {
        setHistories(props.historiesData);
    }, [props.historiesData]);

    const onDelete = (historyIdx: number, matchIdx: number) => {
        remove(ref(db, 'histories/' + historyIdx + '/matches/' + matchIdx));
    }

    return (
        <div className='list'>
            <Accordion>
                {histories && histories.map((history: Histories, historyIdx: number) => {
                    return (
                        <AccordionItem key={historyIdx} header={
                            <div className='accord-header p-2 text-black font-bold w-full border-b-2'>
                                {history.name}
                            </div>
                        } className='border-2 mb-2 w-full rounded-lg' initialEntered={histories.length - 1 === historyIdx}>
                            {history.matches && history.matches.map((match: Matches, matchIdx: number) => {
                                return (
                                    <div className='flex justify-between items-center mb-5 px-2' key={matchIdx}>
                                        <Link to={`/match/${matchIdx}`} key={matchIdx} className='w-full'>
                                            <div className='card-list p-3 w-100 flex justify-between items-center flex-row rounded-lg shadow-md'>
                                                <p className='flex flex-col md:flex-row items-center'>Match-{matchIdx + 1} <span className={'md:ms-1 px-2 rounded-full text-xs ' + (match?.status === 1 ? 'bg-lime-400' : 'bg-slate-400')}>{ match?.status === 1 ? 'On Going' : 'Finished' }</span></p>
                                                <div className='flex justify-center items-center'>{WinTag(match.players, match.winner)}</div>
                                            </div>
                                        </Link>
                                        <span className='ms-2 hover:cursor-pointer rounded-lg shadow-lg p-2' onClick={() => onDelete(historyIdx, matchIdx)}><FaTrash className='text-rose-700' /></span>
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
