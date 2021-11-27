import React from 'react'

export default function GameMoveListBox({ gameMoves, visibleStepNumber, timeTravelMove }) {

    var movesList = [];
    gameMoves.forEach((item, index) => {
        const hideMarkerClass = (visibleStepNumber !== index) ? 'badge-button-hidden' : '';
        
        var moveColorBtn = 'terminal-move-button';
        const playerMoveColorTag = item.move.at(0);
        if (playerMoveColorTag === 'B') moveColorBtn = 'blue-move-button'
        if (playerMoveColorTag === 'R') moveColorBtn = 'red-move-button'; 

        movesList.push(<li key={index}>
            <button className={`move-button ${moveColorBtn}`} onClick={() => timeTravelMove(index)}>
                <b>#{index} :</b> {item.move}
            </button>
            <div className={`badge-button ${hideMarkerClass}`}>O</div>
        </li>)
    })
    return (
        <ul className="move-list">
          {movesList.reverse()}
        </ul>
    )

}