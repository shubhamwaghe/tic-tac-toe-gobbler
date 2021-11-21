import React from 'react'
import { useDrag } from 'react-dnd'
import redsmall from '../img/red-small.png'
import bluesmall from '../img/blue-small.png'
import redmedium from '../img/red-medium.png'
import bluemedium from '../img/blue-medium.png'
import redlarge from '../img/red-large.png'
import bluelarge from '../img/blue-large.png'

export default function Piece({ pieceName, position, movePiece }) {

    // Example Piece Name : RS1 => Image - Red Small
    function getPieceImage() {
        const colorSizeTag = pieceName.substring(0,2);
        switch (colorSizeTag) {
          case 'RS': return redsmall;
          case 'RM': return redmedium;
          case 'RL': return redlarge;
          case 'BS': return bluesmall;
          case 'BM': return bluemedium;
          case 'BL': return bluelarge;
        }
    }

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

        <img src={getPieceImage()} ref={drag} className="piece-image" alt="Piece" style={{
            opacity: isDragging ? 0.5 : 1,
            fontSize: 25,
            fontWeight: 'bold',
            cursor: 'move',
        }} />
        
    )
}
