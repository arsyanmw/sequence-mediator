import {Sidebar} from "../components";
import {Route, Switch} from "react-router-dom";
import React from "react";
import {routes} from "../routes";
import {Routes} from "../interfaces";
import './index.css';

export const AppLayout = () => {
    return (
        <div className='app-wrapper h-screen w-screen flex'>
            <Sidebar />
            <div className='pages w-full relative p-3 overflow-auto'>
                <Switch>
                    {routes.map((route: Routes, idx) => (
                        <Route exact={route.exact} path={route.path} key={idx}>
                            {route.component}
                        </Route>
                    ))}
                </Switch>
            </div>
        </div>
    )
}
