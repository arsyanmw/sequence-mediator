import {FaHome} from "@react-icons/all-files/fa/FaHome";
import {FaUsers} from "@react-icons/all-files/fa/FaUsers";
import {FreeMatchPage, HomePage, MatchPage, PLayersPage, SettingsPage, TournamentPage} from "../pages";
import {FaTrophy} from "@react-icons/all-files/fa/FaTrophy";
import {FaTheaterMasks} from "@react-icons/all-files/fa/FaTheaterMasks";
import {FaCog} from "@react-icons/all-files/fa/FaCog";

export const routes = [
    {
        path: '/',
        exact: true,
        title: 'Home',
        component: <HomePage />,
        icon: <FaHome />,
        show: true,
        children: null,
    },
    {
        path: '/match/free-match',
        exact: false,
        title: 'Free Match',
        component: <FreeMatchPage />,
        icon: <FaTheaterMasks />,
        show: true,
        children: null,
    },
    {
        path: '/match/tournament',
        exact: true,
        title: 'Tournament',
        component: <TournamentPage />,
        icon: <FaTrophy />,
        show: true,
        children: null,
    },
    {
        path: '/match/:matchType/:matchId/:matchTypeId?',
        exact: false,
        title: 'Match',
        component: <MatchPage />,
        icon: <FaHome />,
        show: false,
        children: null,
    },
    {
        path: '/players',
        exact: true,
        title: 'Players',
        component: <PLayersPage />,
        icon: <FaUsers />,
        show: true,
        children: null
    },
    {
        path: '/settings',
        exact: true,
        title: 'Settings',
        component: <SettingsPage />,
        icon: <FaCog />,
        show: true,
        children: null
    },
]
