import React, { Component } from 'react'
import socketClient  from "socket.io-client";
import GobblerBoard from './GobblerBoard';
import GameMoveListBox from './GameMoveListBox';
import GameNextStepBox from './GameNextStepBox';
import GameNextStepsMiniBox from './GameNextStepsMiniBox';
import PlayerWelcomeModal from './PlayerWelcomeModal';
import PlayerLabel from './PlayerLabel';
import GameRestartModal from './GameRestartModal';
import calculateWinner from './util/WinnerCheckUtil'
import { assertMovableFromPiecePosition, assertMovableToPiecePosition, 
    assertMovableToSkipSquare, assertValidCurrentPlayer } from './util/ValidMoveAssertUtil'
import { getMoveString, removeItem, getFullColorName } from './util/MiscellaneousUtil'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import restart from '../img/restart.png'

export default class GobblerGame extends Component {

    getInitialState() {
        return {
            stepNumber: 0,
            visibleStepNumber: 0,
            myColor: null,
            playerNames: { 'B': "", 'R': "" },
            playerJoined: { 'B': false, 'R': false },
            winnerPlayer: null,
            gameOver: false,
            gameRestartModalShow: false,
            gameRestartRequestColor: null,
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

    movePiece(pieceColor, pieceName, currentPosition, targetPosition, emittedEventMove = false) {

        if (this.state.gameOver) return;
        if (this.state.myColor === pieceColor && this.state.visibleStepNumber !== this.state.stepNumber) {
            this.timeTravelMove(this.state.stepNumber);
            toast.info('Moved game to latest state!', {
                position: "top-right",
                autoClose: 2500,
            });
            return;
        }
        if (currentPosition === targetPosition) return;

        // Online Play but Trying to play opposite color
        if ((pieceColor !== this.state.myColor && this.state.myColor !== null) && !emittedEventMove) 
            return this.alertUser('Illegal Move! Not Your Color!');

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        var current = history[history.length - 1];

        if(!assertValidCurrentPlayer(pieceName, this.getPlayerToMove())) return this.alertUser('Illegal Move! Not Your Turn!');
        if(!assertMovableFromPiecePosition(current, pieceName, currentPosition)) return this.alertUser('Illegal Move! Invisible Piece!');
        if(!assertMovableToPiecePosition(current, pieceName, targetPosition)) return this.alertUser('Illegal Move! Cannot move over similar/larger piece!');
        if(!assertMovableToSkipSquare(currentPosition, targetPosition)) return this.alertUser('Illegal Move! Cannot skip squares!');

        var nextSquareState = JSON.parse(JSON.stringify(current.squares));

        nextSquareState[currentPosition] = removeItem(nextSquareState[currentPosition], pieceName);
        nextSquareState[targetPosition].push(pieceName);

        var moveObject = {
            move: getMoveString(pieceName, currentPosition, targetPosition),
            squares: nextSquareState
        }

        this.setState({
            history: history.concat(moveObject),
            stepNumber: history.length,
            visibleStepNumber: history.length
        });

        if (this.state.myColor === pieceColor) {
            this.emitMoveToPlayer(this.state.myColor, pieceName, currentPosition, targetPosition, moveObject);
        }
        this.checkForWinner(nextSquareState);

    }

    // resumeGameState(history) {
    //     console.log(history);
    //     console.log(this.state.history);
    //     this.setState({
    //         history: history,
    //         stepNumber: history.length,
    //         visibleStepNumber: history.length
    //     });
    // }

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

            if (this.state.myColor === winnerPlayer) {
                // this.socket.emit('game-over', {
                //     winnerPlayer: winnerPlayer,
                //     playerNames: this.state.playerNames
                // });  
                this.socket.emit('game-over', this.state);
            }
        }

    }

    setPlayerName(playerColor, playerName) {
        const updatedPlayerNames = this.state.playerNames;
        updatedPlayerNames[playerColor] = playerName;
        this.setState({ playerNames: updatedPlayerNames })
    }

    setPlayerJoined(playerColor, playerJoined) {
        const updatedPlayerJoined = this.state.playerJoined;
        updatedPlayerJoined[playerColor] = playerJoined;
        this.setState({ playerJoined: updatedPlayerJoined })
    }

    handlePlayerJoin(color, playerName) {
        const msgString = `${playerName} has joined the Game as Player - ${getFullColorName(color)}!`
        this.setPlayerName(color, playerName);
        this.setPlayerJoined(color, true);
        this.infoUser(msgString);
    }

    handlePlayerLeft(color, playerName) {
        const msgString = `${playerName} has left the Game as Player - ${getFullColorName(color)}!`
        this.setPlayerName(color, "");
        this.setPlayerJoined(color, false);
        this.setState({ myColor: null });
        this.playOffline();
        this.infoUser(msgString);
    }

    infoUser(message) {
        toast.info(message, {
            position: "top-right",
            autoClose: 6000,
        });
    }

    alertUser(message) {
        toast.warn(message, {
            position: "top-right",
            autoClose: 3000,
        });
    }

    restartGame(restartRequest = false) {
        if (this.state.myColor === null || restartRequest) {
            // Player if playing offline or Game Restart Request Accepted
            toast.info('Game Restarted!', {
                position: "top-right",
                autoClose: 1500,
            });
            var myColor = null, playerJoined = null, playerNames = null;
            if (restartRequest) {
                myColor = this.state.myColor;
                playerJoined = this.state.playerJoined;
                playerNames = this.state.playerNames;
            }
            this.setState(this.getInitialState());
            if (restartRequest) {
                this.setState({ myColor : myColor, playerJoined: playerJoined, playerNames: playerNames });
            }
        } else {
            this.socket.emit('game-restart-request', {
                "requestColor": this.state.myColor
            });
            toast.info('Game Restart Request Sent!', {
                position: "top-right",
                autoClose: 2000,
            });
        }
    }

    handleGameRestartRequest(requestColor) {
        this.setState({ gameRestartModalShow: true, gameRestartRequestColor: requestColor });
    }

    acceptGameRestartRequest() {
        this.socket.emit('game-restart-request-accepted')
        this.setState({ gameRestartModalShow: false, gameRestartRequestColor: null });
    }

    rejectGameRestartRequest() {
        this.socket.emit('game-restart-request-rejected')
        this.setState({ gameRestartModalShow: false, gameRestartRequestColor: null });
    }

    forceOffline() {
        this.setState({ myColor: null });
        this.infoUser('You are now playing offline!');
    }

    /* Socket Interactions */
    setupSocketInteractions() {

        // The context of `this` changes, hence using self
        var self = this;
        this.socket.on('move-piece', function(data){
            self.movePiece(data.pieceColor, data.pieceName, data.currentPosition, data.targetPosition, true);
        });

        // Someone joined the channel notification!
        this.socket.on('join-channel-notification', function({ color, playerName }){
            self.handlePlayerJoin(color, playerName)
        });

        this.socket.on('left-channel-notification', function({ color, playerName }){
            self.handlePlayerLeft(color, playerName)
        });

        this.socket.on('game-restart-request', function({ requestColor }){
            console.log(requestColor);
            self.handleGameRestartRequest(requestColor);
        });

        this.socket.on('force-offline', function({ message }){
            self.infoUser(message);
            self.forceOffline();
        });

        this.socket.on('game-restart-request-accepted', function(data) {
            self.restartGame(true);
        });

        this.socket.on('game-restart-request-rejected', function(data) {
            self.infoUser("Game Restart Request rejected!");
        });

        // this.socket.on('patch-game-state', function({ history }){
        //     console.log(history);
        //     self.resumeGameState(history);
        // });
    }

    emitMoveToPlayer(pieceColor, pieceName, currentPosition, targetPosition, moveObject) {
        this.socket.emit('move-piece', {
            "pieceColor": pieceColor, 
            "pieceName": pieceName, 
            "currentPosition": currentPosition,
            "targetPosition": targetPosition,
            "moveObject": moveObject
        });
    }

    joinBluePlayer(bluePlayerName) {
        this.setState({ myColor: 'B' });
        // this.setPlayerName('B', bluePlayerName);
        this.socket.emit('join-channel', {
            "color": 'B',
            "playerName": bluePlayerName
        });
    }

    joinRedPlayer(redPlayerName) {
        this.setState({ myColor: 'R'});
        // this.setPlayerName('R', redPlayerName);
        this.socket.emit('join-channel', {
            "color": 'R',
            "playerName": redPlayerName
        });
    }

    playOffline() {
        if (this.state.myColor !== null) {
            this.socket.emit('channel-leave-request', { color: this.state.myColor });
        }
        this.infoUser('You are now playing offline!');
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.visibleStepNumber];

        return (
            <div>
                <GameRestartModal gameRestartModalShow={this.state.gameRestartModalShow} 
                gameRestartRequestColor={this.state.gameRestartRequestColor} 
                playerNames={this.state.playerNames} 
                acceptGameRestartRequest={() => this.acceptGameRestartRequest()}
                rejectGameRestartRequest={() => this.rejectGameRestartRequest()}/>

                <PlayerWelcomeModal playerNames={this.state.playerNames} 
                playerJoined={this.state.playerJoined}
                setPlayerName={(color, playerName) => this.setPlayerName(color, playerName)} 
                joinBluePlayer={(bluePlayerName) => this.joinBluePlayer(bluePlayerName)} 
                joinRedPlayer={(redPlayerName) => this.joinRedPlayer(redPlayerName)} 
                playOffline={() => this.playOffline()} />

                <ToastContainer autoClose={10000} hideProgressBar={false}
                newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss />
                <div className="game game-xs">
                    <div className="game-board game-board-xs">
                        <PlayerLabel playerColorLabel='R' myColor={this.state.myColor} playerNames={this.state.playerNames} />
                        <GobblerBoard squares={current.squares}
                            movePiece={(pieceColor, pieceName, currentPosition, targetPosition) => 
                                this.movePiece(pieceColor, pieceName, currentPosition, targetPosition)}
                         />
                        <PlayerLabel playerColorLabel='B' myColor={this.state.myColor} playerNames={this.state.playerNames} />
                        <GameNextStepsMiniBox gameOver={this.state.gameOver} winnerPlayer={this.state.winnerPlayer}
                            playerToMove={this.getPlayerToMove()} playerNames={this.state.playerNames} />
                    </div>
                    <div className="game-info hidden-xs">
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
                    <div className="game-info-xs game-info-visible-xs">
                        <button className="restart-btn restart-btn-xs navy" onClick={() => this.restartGame()}>
                            <img src={restart} className="action-image-xs"  alt="Restart Game"/>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
