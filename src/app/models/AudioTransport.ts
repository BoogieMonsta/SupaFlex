export enum Transport {
    Pause = 'pause',
    Stop = 'stop',
    Rewind = 'rewind',
    FastForward = 'fast-forward',
    Play = 'play',
    Record = 'record',
}

export enum TransportState {
    Paused = 'paused',
    Stopped = 'stopped',
    Rewinding = 'rewinding',
    FastForwarding = 'fast-forwarding',
    Playing = 'playing',
    Recording = 'recording',
}

// TODO make it work with multiple keyboard layouts
// This is for QWERTY
export const keyMap = new Map<string, string>([
    [Transport.Pause + '1', 'q'],
    [Transport.Stop + '1', 's'],
    [Transport.Rewind + '1', 'w'],
    [Transport.FastForward + '1', 'e'],
    [Transport.Play + '1', 'f'],
    [Transport.Pause + '2', 'j'],
    [Transport.Stop + '2', 'k'],
    [Transport.Rewind + '2', 'i'],
    [Transport.FastForward + '2', 'o'],
    [Transport.Play + '2', 'l'],
    [Transport.Record + '2', ';'],
]);