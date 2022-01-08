import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { Provider } from 'react-keep-alive';
import { createBrowserHistory } from 'history';
import * as serviceWorker from './serviceWorker';
import ReactGA from 'react-ga';

const TRACKING_ID = process.env.REACT_APP_GA_ID; // TRACKING_ID
ReactGA.initialize(TRACKING_ID);

const history = createBrowserHistory();

// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});


// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
    <Router history={history}>
      <Provider>
        <App />
      </Provider>
    </Router>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
