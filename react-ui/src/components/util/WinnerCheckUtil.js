export default function calculateWinner(squaresMap) {

    function transformToArrayRepresentation(squaresMap) {
        var squaresList = [];
        squaresList.push((squaresMap['A3'].at(-1) !== undefined) ? squaresMap['A3'].at(-1).slice(0,1) : null);
        squaresList.push((squaresMap['B3'].at(-1) !== undefined) ? squaresMap['B3'].at(-1).slice(0,1) : null);
        squaresList.push((squaresMap['C3'].at(-1) !== undefined) ? squaresMap['C3'].at(-1).slice(0,1) : null);

        squaresList.push((squaresMap['A2'].at(-1) !== undefined) ? squaresMap['A2'].at(-1).slice(0,1) : null);
        squaresList.push((squaresMap['B2'].at(-1) !== undefined) ? squaresMap['B2'].at(-1).slice(0,1) : null);
        squaresList.push((squaresMap['C2'].at(-1) !== undefined) ? squaresMap['C2'].at(-1).slice(0,1) : null);

        squaresList.push((squaresMap['A1'].at(-1) !== undefined) ? squaresMap['A1'].at(-1).slice(0,1) : null);
        squaresList.push((squaresMap['B1'].at(-1) !== undefined) ? squaresMap['B1'].at(-1).slice(0,1) : null);
        squaresList.push((squaresMap['C1'].at(-1) !== undefined) ? squaresMap['C1'].at(-1).slice(0,1) : null);
        return squaresList;
    }

    /***
     * (6)  (7)  (8)
     * (3)  (4)  (5)
     * (0)  (1)  (2)
    ***/
    const squares = transformToArrayRepresentation(squaresMap)
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const winnerSet = new Set();
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            winnerSet.add(squares[a]);
        }
    }
    switch(winnerSet.size) {
        case 2: return "D";
        case 1: return winnerSet.values().next().value;
        default: return null;
    }
}
