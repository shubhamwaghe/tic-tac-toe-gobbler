function getMoveString(pieceName, currentPosition, targetPosition) {
    const currentColor = pieceName.substring(0,1); // Gives : 'R' / 'B'
    const sizeTag = pieceName.substring(1,2); // Gives : 'S' / 'M' / 'L'
    const currentPositionString = (['BLUE_GROUND', 'RED_GROUND'].includes(currentPosition)) ? 'OO' : currentPosition;
    return `${currentColor}:${sizeTag}-${currentPositionString}-${targetPosition}`;

}

function removeItem(arr, item) {
    return arr.filter(el => el !== item);
}

export { getMoveString, removeItem }