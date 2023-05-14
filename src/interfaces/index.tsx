export interface Players {
    id: number,
    name: string,
    isViolation: boolean,
    time: number,
    color: string,
    totalTurn: number,
    onTurn: boolean,
    isWinner: boolean,
}

export interface Matches {
    mediatorName: string,
    name: string,
    status: number,
    isPaused: boolean,
    totalTurnMatch: number,
    elapsedTime: number,
    lastPlayerRun: number,
    winner: number,
    players: Players[]
}
