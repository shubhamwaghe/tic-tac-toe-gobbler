function assertMovableFromPiecePosition(current, pieceName, currentPosition) {

    if(['BLUE_GROUND', 'RED_GROUND'].includes(currentPosition)) return true;
    
    const currentPositionPieces = current.squares[currentPosition];
    return currentPositionPieces.at(-1) === pieceName;
}

function assertMovableToPiecePosition(current, pieceName, targetPosition) {
    
    if (current.squares[targetPosition].length === 0 ) return true;

    const currentSizeTag = pieceName.substring(1,2); // Gives : 'S' / 'M' / 'L'
    const targetSizeTag = current.squares[targetPosition].at(-1).substring(1,2);
    if (currentSizeTag === 'S') return false; // Small cannot move over any piece
    if (currentSizeTag === 'M' && ['M', 'L'].includes(targetSizeTag)) return false; // Medium cannot move over Medium, Large
    if (currentSizeTag === 'L' && targetSizeTag === 'L') return false; // Large cannot move over Large

    return true;

}

function assertMovableToSkipSquare(currentPosition, targetPosition) {
    // Do not allow movement on skip squares on the board
    if(!['BLUE_GROUND', 'RED_GROUND'].includes(currentPosition)) {
        const currentColumn = currentPosition.substring(0,1).charCodeAt(0);
        const currentRow = parseInt(currentPosition.substring(1,2));
        const targetColumn = targetPosition.substring(0,1).charCodeAt(0);
        const targetRow = parseInt(targetPosition.substring(1,2));
        if (Math.abs(targetColumn - currentColumn) > 1 || Math.abs(targetRow - currentRow) > 1)
            return false;
    } 
    return true;

}

function assertValidCurrentPlayer(pieceName, playerToMove) {
    const currentColor = pieceName.substring(0,1); // Gives : 'R' / 'B'
    if (playerToMove !== currentColor) return false;
    return true;
}

export { assertMovableFromPiecePosition, assertMovableToPiecePosition, assertMovableToSkipSquare, assertValidCurrentPlayer }
