import {Link, useLocation} from "react-router-dom";
import React, {useState} from "react";
import {routes} from "../../routes";
import {Routes} from "../../interfaces";
import {FaList} from "@react-icons/all-files/fa/FaList";
import {FaChevronLeft} from "@react-icons/all-files/fa/FaChevronLeft";
import logo from '../../assets/images/logo.png';

export const Sidebar = () => {
    const { pathname } = useLocation();
    const [isShow, setIsShow] = useState(false);
    
    const isExactPath = (path: string) => {
        if (path === '/') {
            return pathname === path;
        }

        return pathname.includes(path)
    };

    return (
        <div className={"wrapper h-full w-1/6 fixed z-50"}>
            <div className="sidebar-desktop h-full shadow-xl p-4 hidden md:block relative bg-white">
                <div className="wrapper relative h-full w-full">
                    <ul>
                        {routes.map((route: Routes, idx) => {
                            return route.show && (
                                <li key={idx}>
                                    <Link to={route.path}>
                                        <div className={'nav-list w-full shadow-md rounded-lg p-4 flex items-center mb-2' + (isExactPath(route.path) ? ' bg-blue-400 text-white ms-1' : ' text-black')}>
                                            {route.icon} <span className={"font-bold ms-2"}>{route.title}</span>
                                        </div>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="logo absolute w-full flex justify-center items-center bottom-2 flex flex-col">
                        <img src={logo} alt="sequence-logo" className="rounded-lg" />
                        <span className="font-semibold text-sm">by <span className="text-italic">EUEVIBES</span></span>
                    </div>
                </div>
            </div>
            {isShow ? (
                <div className="sidebar-mobile h-full w-full shadow-xl p-1 block md:hidden relative bg-white">
                    <div className="wrapper relative h-full w-full">
                        <ul>
                            {routes.map((route: Routes, idx) => {
                                return route.show && (
                                    <li key={idx}>
                                        <Link to={route.path} onClick={() => setIsShow(false)}>
                                            <div className={"nav-list w-full shadow-md rounded-lg p-4 flex justify-center items-center mb-2" + (isExactPath(route.path) ? " bg-blue-400 text-white" : " text-black")}>
                                                {route.icon}
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="sidebar-collapse absolute bottom-0 w-full p-4 flex justify-center items-center" onClick={() => setIsShow(false)}>
                            <FaChevronLeft />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="sidebar-mobile absolute left-0 top-12 w-1/2 shadow-md rounded-tr-lg rounded-br-lg p-2 block md:hidden bg-white" onClick={() => setIsShow(true)}>
                    <FaList />
                </div>
            )}
        </div>
    )
}
