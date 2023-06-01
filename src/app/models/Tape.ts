export interface Tape {
    name: string;
    L: any; // elementary audio sample node
    R: any; // elementary audio sample node
    path_L: string; // path to Left audio sample, also used as key
    path_R: string; // path to Right audio sample, also used as key
    playbackSpeed: number;
    playbackRate: any; // reflects playbackSpeed as an elementary audio node
    isPlaying: boolean;
    playing: any; // reflects isPlaying as an elementary audio node
    sloppiness: number;
}
