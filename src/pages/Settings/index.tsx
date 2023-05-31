import {TitlePage} from "../../components";
import React, {useEffect, useState} from "react";
import {child, get, onValue, ref, update} from "firebase/database";
import {db} from "../../firebase/config";
import {FaTired} from "@react-icons/all-files/fa/FaTired";
import Switch from 'react-switch';
import {Settings, Tournament} from "../../interfaces";

const SettingsPage = () => {
    const [settings, setSettings] = useState<Settings>();
    const [onGoingTournament, setOnGoingTournament] = useState<Tournament>();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        onValue(ref(db, 'settings/'), snapshot => {
            if (snapshot.exists()) {
                setSettings(snapshot.val());
            }
        })

        get(child(ref(db), 'matches/tournament/')).then(snapshot => {
            if (snapshot.exists()) {
                const tournaments: Tournament[] = snapshot.val();
                tournaments.find(tournament => {
                    if (tournament.status === 1 && tournament.endAt === '') {
                        setOnGoingTournament(tournament);
                    }
                    return true;
                });
            }
        });
    }, []);

    const toggleSwitch = (checked: boolean, key: string) => {
        let currSettings = settings;
        if (currSettings) {
            if (key === 'tournamentMode') {
                if (onGoingTournament) {
                    currSettings.tournamentMode = checked;
                    update(ref(db, 'settings/'), currSettings);
                } else {
                    setModalVisible(true);
                }
            } else {
                currSettings.withMediator = checked;
                update(ref(db, 'settings/'), currSettings);
            }
        }
    };

    return (
        <div className='container mx-auto pb-20'>
            {settings ? (
                <div className="w-full">
                    <TitlePage title={'Settings'} />

                    <div className="wrapper w-full flex flex-col justify-center items-center">
                        <div className="list w-full md:w-2/6 flex justify-between items-center shadow-md rounded-lg p-4 mb-4">
                            <span className="font-semibold">Tournament Mode</span>
                            <Switch onChange={(checked) => toggleSwitch(checked, 'tournamentMode')} checked={settings.tournamentMode} />
                        </div>
                        <div className="list w-full md:w-2/6 flex justify-between items-center shadow-md rounded-lg p-4 mb-4">
                            <span className="font-semibold">With Mediator</span>
                            <Switch onChange={(checked) => toggleSwitch(checked, 'withMediator')} checked={settings.withMediator} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-data h-screen w-full flex justify-center items-center flex-col text-slate-400 font-bold">
                    <div className="icon text-3xl"><FaTired className="animate-bounce" /></div>
                    <div className="text text-xl">No Players Found.</div>
                </div>
            )}

            {modalVisible && <ModalAlert onOk={() => setModalVisible(false)} />}
        </div>
    )
}

const ModalAlert = (props: { onOk: any }) => {
    return (
        <div className="wrapper fixed top-0 right-0 left-0 bottom-0 h-screen w-screen md:w-full bg-slate-500/[.9] z-50 flex justify-center items-center">
            <div className="modal bg-white w-4/6 md:w-1/6 h-60 rounded-lg shadow-lg flex justify-between items-center flex-col p-5 relative">
                <div className="title font-bold text-lg text-center mb-2">
                    <span>No Upcoming Tournament Created! Create and Start Tournament First.</span>
                </div>

                <div className="button w-full flex justify-center items-center">
                    <button className="bg-blue-300 p-2 rounded-lg w-4/6 cursor-pointer" onClick={props.onOk}>
                        <span className="font-bold">OK</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;
