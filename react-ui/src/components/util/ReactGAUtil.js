import ReactGA from 'react-ga';

function getWinnerPlayerName(winnerPlayer, bluePlayerName, redPlayerName) {
    switch (winnerPlayer) {
        case 'B': return bluePlayerName;
        case 'R': return redPlayerName;
        case 'D': return "DRAW";
        default: return "NA";
    }
}

function recordGameOverEvent(gameState) {
    var bluePlayerName = gameState.playerNames['B'];
    bluePlayerName = (bluePlayerName !== null  && bluePlayerName !== '') ? bluePlayerName : "DEFAULT-BLUE";
    var redPlayerName = gameState.playerNames['R'];
    redPlayerName = (redPlayerName !== null & redPlayerName !== '') ? redPlayerName : "DEFAULT-RED";
    const winnerPlayerName = getWinnerPlayerName(gameState.winnerPlayer, bluePlayerName, redPlayerName);

    ReactGA.event({
        category: 'GAME',
        action: 'GAME_OVER',
        label: winnerPlayerName
    },{
        dimension1: bluePlayerName,
        dimension2: redPlayerName,
        dimension3: winnerPlayerName
    });
}

export { recordGameOverEvent }
