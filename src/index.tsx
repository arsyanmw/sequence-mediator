import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import MatchPage from './pages/Match';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <Switch>
      <Route exact path='/'>
        <HomePage />
      </Route>
      <Route exact path='/match/:matchId'>
        <MatchPage />
      </Route>
    </Switch>
  </Router>
);
