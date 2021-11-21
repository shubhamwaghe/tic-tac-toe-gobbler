import React from 'react'
import Piece from './Piece'
// import { canMoveKnight, moveKnight } from './Game'

import { useDrop } from 'react-dnd'

export default function PieceContainer({ name, pieces, movePiece }) {

    // renderPiece(pieceName, currentPieceContainer){
    //     return <Piece pieceName = {pieceName} position = {currentPieceContainer} movePiece={this.props.movePiece} />
    // }

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        name: name,
        accept: "PIECE",
        drop: () => ({ name: name }),
        collect: monitor => ({
          canDrop: !!monitor.canDrop(),
          isOver: !!monitor.isOver(),
        }),
    }))

    console.log('options', { canDrop, isOver });

    return (
        <div
          ref={drop}
          style={{
            position: 'relative',
            width: '150px',
            height: '80px',
            backgroundColor: '#f5ffea'
          }}
        >
        {console.log("Pieces:", pieces)}
{/*        { pieces.forEach(pieceName => (
          <li key={pieceName} >  
          <Piece pieceName = {pieceName} position = "BLUE_GROUND" movePiece={ movePiece } />
            {pieceName}  
          </li>  
        ))}*/}

{/*        { pieces.forEach(piece => (
          <li key={piece.pieceName} >  
            piece
          </li>  
        ))}*/}

          { pieces }
        </div>
    )
}