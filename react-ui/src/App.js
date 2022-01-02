import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './components/section/Navbar';
import SideNav from './components/section/SideNav';
import GobblerGame from './components/GobblerGame';
import About from './components/section/About';
import GameStats from './components/section/GameStats';
import { Route, Routes } from 'react-router-dom';
import { KeepAlive } from 'react-keep-alive';
import './App.css';

function App() {
  const [message, setMessage] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(null);
  const [gameStats, setGameStats] = useState([]);
  const [gameStatsUrl, setGameStatsUrl] = useState('/api/game-stats');

  const fetchGameStats = useCallback(() => {
    fetch(gameStatsUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        console.log(json.gameStats);
        setMessage(json.message);
        setGamesPlayed(json.gamesPlayed);
        setGameStats(json.gameStats);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
      })
  }, [gameStatsUrl]);

  useEffect(() => {
    fetchGameStats();
  }, [fetchGameStats]);

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <SideNav />
        <Routes>
          <Route path="/" element={ <KeepAlive name="GobblerGame"><GobblerGame /></KeepAlive> } />
          <Route path="/about" element={ <About gamesPlayed={gamesPlayed} /> } />
          <Route path="/game-stats" element={ <GameStats gameStats={gameStats} gamesPlayed={gamesPlayed} /> } />
        </Routes>
    </div>
  );

}

export default App;
