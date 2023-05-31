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
    lastPlayerRun: number,
    winner: number | string,
    status: Statuses,
    players: Players[],
    createdAt: Date | string,
    endAt: Date | string,

}

export interface Colors {
    name: string,
    hex: string;
}

export interface Tournament {
    name: string,
    matches?: Matches[],
    status: Statuses,
    startAt: Date | string,
    endAt: Date | string,
    createdAt: Date | string,
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

export interface Challenger {
    name: string
}
export enum Statuses {
    finished,
    ongoing,
    notstarted
}

export interface Settings {
    tournamentMode: boolean;
    withMediator: boolean;
}
