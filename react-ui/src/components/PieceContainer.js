import React from 'react'

import { useDrop } from 'react-dnd'

export default function PieceContainer({ name, pieces, containerType, movePiece }) {

    const [ collectedProps, drop] = useDrop(() => ({
        name: name,
        accept: "PIECE",
        drop: () => ({ name: name })
    }))

    return (
        <div
          ref={drop}
          className={containerType}
        >
          { pieces }
        </div>
    )
}