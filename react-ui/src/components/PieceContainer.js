import React from 'react'

import { useDrop } from 'react-dnd'

export default function PieceContainer({ name, pieces, containerType, movePiece }) {

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
          className={containerType}
        >
          { pieces }
        </div>
    )
}