import React from 'react'
import sunglasses from '../img/sunglasses.png'

export default function GameNextStepsMiniBox({ gameOver, winnerPlayer, playerToMove, playerNames }) {

   function getFullColorName(colorInitial) {
        if (colorInitial === 'B') return 'BLUE';
        if (colorInitial === 'R') return 'RED';
        console.log("This State cannot Happen!");
    }

    if (gameOver) {
        return(
            <div className="game-next-steps-mini visible-xs">
                <i>We have a winner: </i>
                <b>{getFullColorName(winnerPlayer)} : {playerNames[winnerPlayer]} </b> Wins!!!
                <span><img src={sunglasses} className="sunglasses-img sunglasses-img-xs"  alt="Sunglasses"/></span>
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