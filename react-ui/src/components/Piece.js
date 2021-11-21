import React from 'react'
import { useDrag } from 'react-dnd'

export default function Piece({ pieceName, position, movePiece }) {

    const [{isDragging}, drag] = useDrag(() => ({
        pieceName: pieceName,
        position: position,
        type: "PIECE",
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if(dropResult && dropResult.name){
                movePiece(pieceName, position, dropResult.name);
            } else {
                console.log("No Handling Required!")
            }
            // if(dropResult && dropResult.name === 'Column 1'){
            //     setIsFirstColumn(true)
            // } else {
            //     setIsFirstColumn(false);
            // }
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
      }))

    return (
        <div
          ref={drag}
          style={{
            opacity: isDragging ? 0.5 : 1,
            fontSize: 25,
            fontWeight: 'bold',
            cursor: 'move',
          }}
        >
          <button>Knight ♘ { pieceName ? pieceName : "" }</button>
        </div>
    )
}
