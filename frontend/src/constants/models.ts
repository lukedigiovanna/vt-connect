export interface UserAccount {
    pid: string;
    firstName: string;
    lastName: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date | null;
    locationId: number | null; // will later want to do a JOIN on event and location when retrieving Event data
    hostPid: string; // ditto
    imageUrl: string;
}
