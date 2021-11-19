import React, { Component } from 'react'
import GobblerBoard from './GobblerBoard';

export default class GobblerGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            xIsNext: true,
            stepNumber: 0,
            history: [{ squares: 
                {
                    'A3' : [], 'B3' : [], 'C3' : [],
                    'A2' : [], 'B2' : [], 'C2' : [],
                    'A1' : [], 'B1' : [], 'C1' : [],
                } 
            }]
        }
    }

    handleClick(position) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        console.log(history);
        const current = history[history.length - 1];
        console.log(current);
        // const squares = current.squares.slice();
        
        console.log(position);

        current.squares[position].push('X')
        this.setState({
            history: history.concat({
                squares: current.squares
            }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        return (
            <div className="game">
                <div className="game-board">
                    <GobblerBoard onClick={(position) => this.handleClick(position)} squares={current.squares} />
                </div>
                <div className="game-info">
                </div>

            </div>
        )
    }
}