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
            width: '400px',
            height: '80px',
            backgroundColor: '#f5ffea'
          }}
        >
          { pieces }
        </div>
    )
}