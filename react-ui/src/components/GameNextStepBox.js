import React from 'react'
import sunglasses from '../img/sunglasses.png'

export default function GameMoveListBox({ gameOver, winnerPlayer, playerToMove, playerNames }) {

    function getFullColorName(colorInitial) {
        if (colorInitial === 'B') return 'BLUE';
        if (colorInitial === 'R') return 'RED';
        console.log("This State cannot Happen!");
    }

    if (gameOver) {
        return(
            <div align="center" className="info-player">
                <b>{getFullColorName(winnerPlayer)} : {playerNames[winnerPlayer]} </b> Wins!!!
                <img src={sunglasses} className="sunglasses-img"  alt="Sunglasses"/>
            </div>
        )
    } else {

        return(
            <div align="center" className="info-player">
                <span className="player-name-span">Blue: <b>{playerNames['B']}</b>, Red: <b>{playerNames['R']}</b></span><br/>
                <i>Player to Move: </i><br /> 
                <b>{getFullColorName(playerToMove)} - {playerNames[playerToMove]}</b>
            </div>
        )
    }
}