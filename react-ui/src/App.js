import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './components/section/Navbar';
import SideNav from './components/section/SideNav';
import Game from './components/Game';
import GobblerGame from './components/GobblerGame';
import About from './components/section/About';
import { Route, Routes } from 'react-router-dom';
import { KeepAlive } from 'react-keep-alive';
import './App.css';

function App() {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [url, setUrl] = useState('/api');

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setMessage(json.message);
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <SideNav />
        <Routes>
          <Route path="/" element={ <KeepAlive name="GobblerGame"><GobblerGame /></KeepAlive> } />
          <Route path="/about" element={ <About/> } />
        </Routes>
    </div>
  );

}

export default App;
