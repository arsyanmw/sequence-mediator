export interface Players {
    id: number,
    name: string,
    isViolation: boolean,
    time: number,
    color: string,
    totalTurn: number,
    onTurn: boolean,
}

export interface Matches {
    mediatorName: string,
    name: string,
    isPaused: boolean,
    totalTurnMatch: number,
    elapsedTime: number,
    lastPlayerRun: number,
    winner: number | string,
    status: Statuses,
    players: Players[],
    createdAt: Date,
    endAt: Date,

}

export interface Colors {
    name: string,
    hex: string;
}

export interface Tournament {
    name: string,
    matches?: Matches[],
    status: number,
    createdAt: Date,
    endAt: Date,
}

export interface Routes {
    path: string,
    title: string,
    exact: boolean,
    show: boolean,
    component: any,
    icon: any,
    children: any | null
}

export interface Challanger {
    name: string
}
export enum Statuses {
    finished,
    ongoing,
}
