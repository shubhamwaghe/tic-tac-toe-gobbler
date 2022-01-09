import React from 'react'

export default function PlayerLabel({ playerColorLabel, myColor, playerNames }) {

    function getColorLabel() {
        switch (playerColorLabel) {
          case 'R': return "RED";
          case 'B': return "BLUE";
          default: return;
        }
    }

    return (
        <div className="player-label-xs visible-xs">
            {
                (myColor == playerColorLabel) ? <span><b>{getColorLabel()} [YOU] :</b> {playerNames[playerColorLabel]}</span> : 
                <span><b>{getColorLabel()} :</b> {playerNames[playerColorLabel]}</span>
            } 
        </div>
    )
}