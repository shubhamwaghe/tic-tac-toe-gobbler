import React, { Component } from 'react'
import GobblerBoard from './GobblerBoard';

export default class GobblerGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            xIsNext: true,
            isRest: true,
            stepNumber: 0,
            history: [{ squares: { 
                    'A3' : [], 'B3' : [], 'C3' : [],
                    'A2' : [], 'B2' : [], 'C2' : [],
                    'A1' : [], 'B1' : [], 'C1' : [],
                    'RED_GROUND': ['RS1'],
                    'BLUE_GROUND': ['BS1']
                }
            }]
        }
    }

    testButton(state) {
        console.log("Testing...");
        var current = state.history[0];
        console.log("State: ", this.state);
        console.log("Current: ", current.squares);
        current.squares['RED_GROUND'] = [];
        current.squares['BLUE_GROUND'].push('RS1');

        state.history[0] = current;

        this.setState(state);

        // this.setState({
        //     history: history.concat({
        //         squares: current
        //     }),
        //     xIsNext: !this.state.xIsNext,
        //     stepNumber: history.length
        // });
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

    assertMovableFromPiecePosition(pieceName, currentPosition) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        var current = history[history.length - 1];
        return current.squares[currentPosition].at(-1) == pieceName;
    }

    assertMovableToPiecePosition(pieceName, targetPosition) {
        return true;
    }

    alertUser(message) {
        window.alert(message);
    }

    movePiece(pieceName, currentPosition, targetPosition) {
        if (currentPosition === targetPosition) return this.alertUser('No movement done!');
        if(!this.assertMovableFromPiecePosition(pieceName, currentPosition)) return this.alertUser('Illegal Move! Another piece is over it!');
        if(!this.assertMovableToPiecePosition(pieceName, targetPosition)) return this.alertUser('Illegal Move! Cannot move over larger piece!');

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        console.log("History: ", history);
        var current = history[history.length - 1];
        console.log("Current: ", current);

        console.log("Current Squares: ", current.squares);
        console.log(pieceName, currentPosition, targetPosition)

        current.squares[currentPosition].pop();
        current.squares[targetPosition].push(pieceName);

        console.log("Moving Piece: ", pieceName);
        console.log("Current Position: ", currentPosition);
        console.log("Target Position: ", targetPosition);

        this.setState({
            history: history.concat({
                squares: current.squares
            }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });

        console.log("Final State: ", this.state);
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        return (
            <div className="game">
                <div className="game-board">
                    <GobblerBoard onClick={(position) => this.handleClick(position)} 
                    movePiece={(pieceName, currentPosition, targetPosition) => this.movePiece(pieceName, currentPosition, targetPosition)}
                    squares={current.squares} isRest={this.state.isRest} />
                </div>
                <div className="game-info">
                    <button onClick={ () => this.testButton(this.state) }>Test</button>
                </div>
            </div>
        )
    }


}