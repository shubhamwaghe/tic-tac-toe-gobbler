import React, { Component } from 'react';
import GobblerSquare from './GobblerSquare';
import Piece from './Piece';
import PieceContainer from './PieceContainer';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default class GobblerBoard extends Component {


    renderGobblerSquare(position){
        return <GobblerSquare pieces={this.props.squares[position]}
            onClick={()=>this.props.onClick(position)}
        />
    }

    renderPiece(pieceName, currentPieceContainer){
        return <Piece pieceName = {pieceName} position = {currentPieceContainer} movePiece={this.props.movePiece} />
    }

    renderContainerPieces(containerName) {
        return this.props.squares[containerName].map(pieceName => (
          <li key={pieceName} >  
              <Piece pieceName = {pieceName} position = {containerName} movePiece={this.props.movePiece} />
          </li>  
        ))
    }

    render() {

        return (
            <div>
                <DndProvider backend={HTML5Backend}>
                    <div className="red-piece-ground">
                        <PieceContainer name = "RED_GROUND" pieces = { this.renderContainerPieces('RED_GROUND') } 
                            movePiece={this.props.movePiece} />
                    </div>
                    <br />
                    <br />
                    <div className="border-row">
                        <PieceContainer name = "A3" pieces = { this.renderContainerPieces('A3') } 
                            movePiece={this.props.movePiece} />
                    </div>
                    <br />
                    <div className="blue-piece-ground">
                        <PieceContainer name = "BLUE_GROUND" pieces = { this.renderContainerPieces('BLUE_GROUND') } 
                            movePiece={this.props.movePiece} >


                        </PieceContainer>
                    </div>
                    <br />
                </DndProvider>
            </div>
        )
    }

}