import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, HashRouter } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.render((
  <BrowserRouter>
    <Route exact path="/" component={App}>
    </Route>
  </BrowserRouter>
), document.getElementById('app'));

