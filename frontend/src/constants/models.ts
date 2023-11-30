export interface UserAuth {
    pid: string;
    password: string;
    isAdmin: boolean;
}

export interface UserAccount {
    pid: string;
    firstName: string;
    lastName: string;
    major: string | null;
    bio: string | null;
    isAdmin: boolean; 
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

export const eventDataToEvent = (eventData: any): Event => {
    return {
        ...eventData,
        startTime: new Date(eventData.startTime),
        endTime: eventData.endTime ? new Date(eventData.endTime) : null
    };
};
