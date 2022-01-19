import React from 'react'
import sunglasses from '../img/sunglasses.png';
import mindblown from '../img/mindblown.png';

export default function GameNextStepsMiniBox({ gameOver, winnerPlayer, playerToMove, playerNames }) {

   function getFullColorName(colorInitial) {
        if (colorInitial === 'B') return 'BLUE';
        if (colorInitial === 'R') return 'RED';
        if (colorInitial === 'D') return 'NOBODY';
        console.log("This State cannot Happen!");
    }

    function getEmojiImg() {
        switch(winnerPlayer) {
            default: return sunglasses;
            case 'D': return mindblown;
        }
    }

    if (gameOver) {
        return(
            <div className="game-next-steps-mini visible-xs">
                <i>We have a winner: </i>
                <b>{getFullColorName(winnerPlayer)} : {playerNames[winnerPlayer]} </b> Wins!!!
                <span><img src={getEmojiImg()} className="win-emoji-img win-emoji-img-xs"  alt="Win Emoji"/></span>
            </div>
        )
    } else {

        return(
            <div className="game-next-steps-mini visible-xs">
                <i>Player to Move: </i>
                <b>{getFullColorName(playerToMove)} - {playerNames[playerToMove]}</b>
            </div>
        )
    }
}