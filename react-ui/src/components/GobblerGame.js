import React, { Component } from 'react'
import socketClient  from "socket.io-client";
import GobblerBoard from './GobblerBoard';
import GameMoveListBox from './GameMoveListBox';
import GameNextStepBox from './GameNextStepBox';
import PlayerWelcomeModal from './PlayerWelcomeModal';
import calculateWinner from './util/WinnerCheckUtil'
import { assertMovableFromPiecePosition, assertMovableToPiecePosition, 
    assertMovableToSkipSquare, assertValidCurrentPlayer } from './util/ValidMoveAssertUtil'
import { getMoveString, removeItem } from './util/MiscellaneousUtil'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class GobblerGame extends Component {

    getInitialState() {
        return {
            stepNumber: 0,
            visibleStepNumber: 0,
            playerNames: {
                'B': "Blue Player",
                'R': "Red Player"
            },
            // bluePlayerName: "Blue Player",
            // redPlayerName: "Red Player", 
            winnerPlayer: null,
            gameOver: false,
            history: [{
                    move: "GAME START",
                    squares: { 
                    'A3' : [], 'B3' : [], 'C3' : [],
                    'A2' : [], 'B2' : [], 'C2' : [],
                    'A1' : [], 'B1' : [], 'C1' : [],
                    'RED_GROUND': ['RS1', 'RM1', 'RL1', 'RS2', 'RM2', 'RL2'],
                    'BLUE_GROUND': ['BS1', 'BM1', 'BL1', 'BS2', 'BM2', 'BL2'],
                }
            }]
        }
    }

    constructor(props) {
        super(props);

        // Initialise One Socket Connection
        this.socket = socketClient();
        this.setupSocketInteractions();
        this.state = this.getInitialState();
    }

    getPlayerToMove() {
        const movesMade = this.state.history.length;
        return (movesMade % 2 === 0) ? 'R' : 'B';
    }

    movePiece(pieceName, currentPosition, targetPosition) {
        console.log(pieceName, currentPosition, targetPosition);
        if (this.state.gameOver) return;
        if (this.state.visibleStepNumber !== this.state.stepNumber) {
            this.timeTravelMove(this.state.stepNumber);
            toast.info('Moved game to latest state!', {
                position: "top-right",
                autoClose: 2500,
            });
            return;
        }
        if (currentPosition === targetPosition) return;

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        var current = history[history.length - 1];

        if(!assertValidCurrentPlayer(pieceName, this.getPlayerToMove())) return this.alertUser('Illegal Move! Not Your Turn!');
        if(!assertMovableFromPiecePosition(current, pieceName, currentPosition)) return this.alertUser('Illegal Move! Invisible Piece!');
        if(!assertMovableToPiecePosition(current, pieceName, targetPosition)) return this.alertUser('Illegal Move! Cannot move over similar/larger piece!');
        if(!assertMovableToSkipSquare(currentPosition, targetPosition)) return this.alertUser('Illegal Move! Cannot skip squares!');

        var nextSquareState = JSON.parse(JSON.stringify(current.squares));

        nextSquareState[currentPosition] = removeItem(nextSquareState[currentPosition], pieceName);
        nextSquareState[targetPosition].push(pieceName);

        this.setState({
            history: history.concat({
                move: getMoveString(pieceName, currentPosition, targetPosition),
                squares: nextSquareState
            }),
            stepNumber: history.length,
            visibleStepNumber: history.length
        });

        this.checkForWinner(nextSquareState);
        this.emitMoveToPlayer(pieceName, currentPosition, targetPosition);

    }
    timeTravelMove(moveStepNumber) {
        this.setState({ visibleStepNumber: moveStepNumber });
    }


    checkForWinner(nextSquareState) {
        const winnerPlayer = calculateWinner(nextSquareState);
        if (winnerPlayer !== null) {
            toast.success('We have a winner!', {
                position: "top-right",
                autoClose: 5000,
            });
            this.setState({ gameOver: true, winnerPlayer: winnerPlayer });
        }

    }

    infoUser(message) {
        toast.info(message, {
            position: "top-right",
            autoClose: 6000,
        });
    }

    handlePlayerJoin(color, playerName) {

        const msgString = `${playerName} has joined the Game!`
        this.infoUser(msgString);
    }

    alertUser(message) {
        toast.warn(message, {
            position: "top-right",
            autoClose: 3000,
        });
    }

    restartGame() {
        toast.info('Game Restarted!', {
            position: "top-right",
            autoClose: 1500,
        });
        this.setState(this.getInitialState());
    }

    /* Socket Interactions */
    setupSocketInteractions() {

        // The context of `this` changes, hence using self
        var self = this;
        this.socket.on('move-piece', function(data){
            console.log('The data is: ', data);
            self.movePiece(data.pieceName, data.currentPosition, data.targetPosition);
        });

        // Someone joined the channel notification!
        this.socket.on('join-channel-notification', function({ color, playerName }){
            self.handlePlayerJoin(color, playerName)
        });
    }

    emitMoveToPlayer(pieceName, currentPosition, targetPosition) {
        this.socket.emit('move-piece', {
            "pieceName": pieceName, 
            "currentPosition": currentPosition,
            "targetPosition": targetPosition
        });
    }

    joinBluePlayer(bluePlayerName) {
        const redPlayerName = this.state.playerNames['R']
        this.setState({ playerNames: { 'B': bluePlayerName, 'R': redPlayerName } });
        this.socket.emit('join-channel', {
            "color": 'B',
            "playerName": bluePlayerName
        });
    }

    joinRedPlayer(redPlayerName) {
        const bluePlayerName = this.state.playerNames['B']
        this.setState({ playerNames: { 'R': redPlayerName, 'B': bluePlayerName } });
        this.socket.emit('join-channel', {
            "color": 'R',
            "playerName": redPlayerName
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.visibleStepNumber];

        return (
            <div>
                <PlayerWelcomeModal joinBluePlayer={(bluePlayerName) => this.joinBluePlayer(bluePlayerName)} joinRedPlayer={(redPlayerName) => this.joinRedPlayer(redPlayerName)} />
                <ToastContainer autoClose={10000} hideProgressBar={false}
                newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss />
                <div className="game">
                    <div className="game-board">
                        <GobblerBoard squares={current.squares}
                            movePiece={(pieceName, currentPosition, targetPosition) => 
                                this.movePiece(pieceName, currentPosition, targetPosition)}
                         />
                    </div>
                    <div className="game-info">
                        <GameNextStepBox gameOver={this.state.gameOver} winnerPlayer={this.state.winnerPlayer}
                            playerToMove={this.getPlayerToMove()} playerNames={this.state.playerNames} />
                        <div className="info-move"> 
                            <h3>Moves</h3>
                            <GameMoveListBox gameMoves={this.state.history} visibleStepNumber={this.state.visibleStepNumber}
                                timeTravelMove={(index) => this.timeTravelMove(index)} />
                        </div>

                        <div className="restart-btn-wrapper">
                            <button className="restart-btn navy" onClick={() => this.restartGame()}>RESTART GAME</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
