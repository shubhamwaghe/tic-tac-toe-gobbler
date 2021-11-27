import React from 'react'
import sunglasses from '../img/sunglasses.png'

export default function GameMoveListBox({ gameOver, winnerPlayer, playerToMove }) {

    function getFullColorName(colorInitial) {
        if (colorInitial === 'B') return 'BLUE';
        if (colorInitial === 'R') return 'RED';
        console.log("This State cannot Happen!");
    }

    if (gameOver) {
        return(<div align="center" className="info-player">
            <b>{getFullColorName(winnerPlayer)}</b> Wins!!!
            <img src={sunglasses} className="sunglasses-img"  alt="Sunglasses"/>
        </div>)
    } else {

        return(<div align="center" className="info-player">
            Player to Move: <br /> <b>{getFullColorName(playerToMove)}</b>
        </div>)
    }
}