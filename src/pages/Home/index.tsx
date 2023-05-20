import React, {useEffect, useState} from 'react';
import './index.css';

import {TabOne, TabTwo} from "../../components";
import {onValue, ref} from "firebase/database";
import {db} from "../../firebase/config";
import {Histories} from "../../interfaces";

const HomePage = () => {
    const [tab, setTab] = useState('tab1');
    const [dataTabTwo, setDataTabTwo] = useState<Histories[]>([]);

    useEffect(() => {
        const reference = ref(db, 'histories/');

        onValue(reference, snapshot => {
            if (snapshot.exists()) {
                setDataTabTwo(snapshot.val());
            }
        })
    }, []);

    return (
        <div className='container mx-auto p-4'>
            <div className='wrapper'>
                <div className="tabs flex justify-center w-full">
                    <div className={'current-match p-4 border-2 rounded-bl-lg rounded-tl-lg font-bold' + (tab === 'tab1' && ' tab-active')} onClick={() => setTab('tab1')}>Current Match</div>
                    <div className={'history-match p-4 border-2 rounded-br-lg rounded-tr-lg font-bold' + (tab === 'tab2' && ' tab-active')} onClick={() => setTab('tab2')}>History Match</div>
                </div>

                <div className="wrapper-body mt-5">
                    {tab === 'tab1' && <TabOne />}
                    {tab === 'tab2' && <TabTwo historiesData={dataTabTwo} />}
                </div>
            </div>
        </div>
    )
};

export default HomePage;
