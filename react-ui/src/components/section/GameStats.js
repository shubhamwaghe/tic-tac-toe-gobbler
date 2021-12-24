import React, { Component } from 'react';

export default class GameStats extends Component {
    render() {
        return(
            <div className="game-stats">
                <section>
                    <h1>Game Statistics</h1>
                    <p>Games Stats : <b></b></p>
                    <ol>
                        {
                            this.props.gameStats.map((element, i) => 
                                <li key={i}>BLUE: <b>{element.playerNames['B']}</b>, RED: <b>{element.playerNames['R']}</b>, Winner: <b>{element.playerNames[element.winnerPlayer]}</b></li>)
                        }
                    </ol>
                </section>
            </div>
        )
    }

}
