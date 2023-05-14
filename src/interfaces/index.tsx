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
    isPaused: boolean,
    totalTurnMatch: number,
    elapsedTime: number,
    lastPlayerRun: number,
    winner: number,
    status: Statuses,
    players: Players[]
}

export interface Colors {
    name: string,
    hex: string;
}

export enum Statuses {
    finished,
    ongoing,
}
