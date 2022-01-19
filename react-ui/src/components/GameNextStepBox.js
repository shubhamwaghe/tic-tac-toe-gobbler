import React from 'react';
import sunglasses from '../img/sunglasses.png';
import mindblown from '../img/mindblown.png';

export default function GameMoveListBox({ gameOver, winnerPlayer, playerToMove, playerNames }) {

    function getFullColorName(colorInitial) {
        if (colorInitial === 'B') return 'BLUE';
        if (colorInitial === 'R') return 'RED';
        if (colorInitial === 'D') return 'NOBODY';
        console.log("This State cannot Happen!");
    }

    function getEmojiImg() {
        switch(winnerPlayer) {
            case "D" : return mindblown;
            default: return sunglasses;
        }
    }

    if (gameOver) {
        return(
            <div align="center" className="info-player">
            <span className="player-name-span">Blue: <b>{playerNames['B']}</b>, Red: <b>{playerNames['R']}</b></span><br/>
                <b>{getFullColorName(winnerPlayer)} : {playerNames[winnerPlayer]} </b> Wins!!!
                <img src={getEmojiImg()} className="win-emoji-img"  alt="Sunglasses"/>
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