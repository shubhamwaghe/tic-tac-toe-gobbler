import React, { Component } from 'react';
import Piece from './Piece';
import PieceContainer from './PieceContainer';
// import { DndProvider } from 'react-dnd'
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

export default class GobblerBoard extends Component {

    renderContainerPieces(containerName) {
        return this.props.squares[containerName].map(pieceName => (
              <Piece key={pieceName} pieceName = {pieceName} position = {containerName} movePiece={this.props.movePiece} />
        ))
    }

    render() {

        return (
            <div>
            <DndProvider options={HTML5toTouch}>
                { /* Red Ground */ }
                <div className="red-piece-ground">
                    <PieceContainer name = "RED_GROUND" pieces = { this.renderContainerPieces('RED_GROUND') } 
                        containerType = "piece-ground" movePiece={this.props.movePiece} />
                </div>
                <br />

                { /* Main Board */ }
                <div className="grid-container">
                    { /* 3rd Row */ }
                    <div className="grid-item row-grid-item"><div className="circular-badge">3</div></div>
                    <div className="grid-item">
                        <PieceContainer name = "A3" pieces = { this.renderContainerPieces('A3') } 
                            containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>
                    <div className="grid-item">
                        <PieceContainer name = "B3" pieces = { this.renderContainerPieces('B3') } 
                            containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>
                    <div className="grid-item">
                        <PieceContainer name = "C3" pieces = { this.renderContainerPieces('C3') } 
                        containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>

                    { /* 2nd Row*/ }
                    <div className="grid-item row-grid-item"><div className="circular-badge">2</div></div>
                    <div className="grid-item">
                        <PieceContainer name = "A2" pieces = { this.renderContainerPieces('A2') } 
                            containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>
                    <div className="grid-item">
                        <PieceContainer name = "B2" pieces = { this.renderContainerPieces('B2') } 
                            containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>
                    <div className="grid-item">
                        <PieceContainer name = "C2" pieces = { this.renderContainerPieces('C2') } 
                        containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>

                    { /* 1st Row*/ }
                    <div className="grid-item row-grid-item"><div className="circular-badge">1</div></div>
                    <div className="grid-item">
                        <PieceContainer name = "A1" pieces = { this.renderContainerPieces('A1') } 
                            containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>
                    <div className="grid-item">
                        <PieceContainer name = "B1" pieces = { this.renderContainerPieces('B1') } 
                            containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>
                    <div className="grid-item">
                        <PieceContainer name = "C1" pieces = { this.renderContainerPieces('C1') } 
                        containerType = "piece-square" movePiece={this.props.movePiece} />
                    </div>

                    { /* Column Header */ }
                    <div className="grid-item column-grid-item"></div>
                    <div className="grid-item column-grid-item"><div className="circular-badge">A</div></div>
                    <div className="grid-item column-grid-item"><div className="circular-badge">B</div></div>
                    <div className="grid-item column-grid-item"><div className="circular-badge">C</div></div>
                </div>
                <br />

                { /* Blue Ground */ }
                <div className="blue-piece-ground">
                    <PieceContainer name = "BLUE_GROUND" pieces = { this.renderContainerPieces('BLUE_GROUND') } 
                        containerType = "piece-ground" movePiece={this.props.movePiece} >
                    </PieceContainer>
                </div>
            </DndProvider>
            </div>
        )
    }

}