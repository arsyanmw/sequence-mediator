import {Statuses} from "../interfaces";

export const tournamentStatuses = (status: number) => {
    switch (status) {
        case Statuses.notstarted:
            return 'Not Started';
        case Statuses.ongoing:
            return 'On Going';
        case Statuses.finished:
            return 'Finished';
        default:
            return 'Not Started';
    }
}
