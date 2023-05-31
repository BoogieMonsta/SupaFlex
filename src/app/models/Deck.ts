import { TransportState } from "./AudioTransport";

export interface Deck {
    previousState: TransportState;
    currentState: TransportState;
}